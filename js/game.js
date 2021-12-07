// Game Engine
class Game {
    constructor() {
        this.player = new Player(-0, 0, 13, 18, 100);
        this.entities = [];
        this.display = new Render(256, 160) //512 480
        this.keysDown = {};
        this.level = 1;
        this.tile_map = {
            tiles: this.map(),
            paths: this.map_paths(this.map())
        };
        this.settings = {
            panning: true,
            hitbox: false
        };
    }

        // Reset the game when the player catches a monster
    reset() {
        this.player.x = 0;
        this.player.y = 0;

        
        let entity = new Monster(0, 0, 14, 10, 72);
        this.entities.push(entity)
        let entity2 = new Monster(160, 0, 14, 10, 72);
        this.entities.push(entity2)
        let entity3 = new Monster(144, 0, 14, 10, 72);
        this.entities.push(entity3)
    }

    // Collision

    entity_collide(entity1, entity2) {
        if (entity1.x < entity2.x + entity2.w &&
            entity1.x + entity1.w > entity2.x &&
            entity1.y < entity2.y + entity2.h &&
            entity1.h + entity1.y > entity2.y) {
            return true};
        return false;
    }
    
    // Gravity
    
    gravity(entity) {
        const h = 0.4 * (entity.fall_time / 3)
        entity.y += h;
    }

    // deals with collision on tile map
    physics(entity) {
        if (!entity.grounded && entity.fall_time>0) {
            this.gravity(entity);
        }
        entity.fall_time++;

        var ground = false
        for (var i=0; i<this.tile_map.tiles.length; i++) {
            for (var j=0; j<this.tile_map.tiles[1].length; j++) {
                var tile = this.tile_map.tiles[i][j];
                if (tile === 1) {       // # 1: Dirt
                    var Tile = {
                        x: 16*(j),
                        y: this.display.canvas.height-16*(this.tile_map.tiles.length-i),
                        w: 16,
                        h: 16
                    };
                    if (entity.x < Tile.x + Tile.w &&
                        entity.x + entity.w > Tile.x &&
                        entity.y < Tile.y + Tile.h &&
                        entity.h + entity.y > Tile.y) {
                        
                        // Detect tile collision to the right
                        if (Tile.x <= entity.x+entity.w && entity.x+entity.w <= Tile.x+6 && entity.y+entity.h-4 >= Tile.y) {
                            entity.x = Tile.x-entity.w;
                            entity.move_time = 1;
                        }
                        // Detect tile collision to the left
                        else if (Tile.x+Tile.w-6 <= entity.x && entity.x <= Tile.x+Tile.w && entity.y+entity.h-4 >= Tile.y) {
                            entity.x = Tile.x + Tile.w
                            entity.move_time = 1;
                        }
                        // Detect ceiling collision
                        else if (Tile.y < entity.y && entity.y < Tile.y+Tile.h && !entity.grounded) {
                            entity.y = Tile.y + Tile.h
                            entity.fall_time = 0    // Remove jump acceleration after hitting head
                        }

                        // Detect ground collision
                        else if (entity.y < Tile.y && entity.fall_time > 0) {
                            entity.y = Tile.y - entity.h +.001;
            
                            ground = true;
                        }
                    };
                }
            }
        }
        if (ground) {
            entity.fall_time = 0;
            entity.grounded = true;
        }
        else {
            entity.grounded = false;
        }
    }

    // Update game objects
    update(modifier) {
        
        this.player.update(modifier)

        for (let i=0; i<this.entities.length; i++) {
            let entity = this.entities[i];
            entity.update(modifier, this.tile_map.paths);
            this.physics(entity);
        }

        this.physics(this.player);
        
        //console.log(this.player.grounded)
        //var entities = [this.entity]
        this.display.update(this.settings, this.tile_map, this.player, this.entities);


        if (this.player.y > this.display.canvas.height) {this.reset()}
    }

    map() {
        var tile_map = Array(8).fill(null).map(() => Array(16).fill(0));
        tile_map[7] = Array(16).fill(1);
        tile_map[6][9] = 1;
        tile_map[4][3] = 1;
        tile_map[4][5] = 1;
        
        return tile_map;
    }

    map_paths(tile_map) {
        let map_paths = [];
        for (let i=0; i<tile_map.length; i++) {
            for (let j=0; j<tile_map[1].length; j++) {
                if (tile_map[i][j] === 1 && i > 0) {
                    if (tile_map[i-1][j] !== 1) {
                        map_paths.push([i-1, j]);
                    }
                }
            }
        }
        console.log(map_paths);
        return map_paths;
    }
}


// game loop
main = () => {
	var now = Date.now();
	var delta = now - then;

	game.update(delta / 1000);
	then = now;

	requestAnimationFrame(main);
};


const game = new Game();
var then = Date.now();
game.reset();

main();

