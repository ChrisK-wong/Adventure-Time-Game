class Render {
    constructor(width, height) {
        // canvas
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width;
        this.canvas.height = height;
        this.assets = new Assets()
        document.getElementById("gameDisplay").appendChild(this.canvas);
        this.frame = 0;
        this.frame_ = 0;
        this.ctx.imageSmoothingEnabled = false;
    }

    
    update(settings, tile_map, player, entities) {
        // Draw everything
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "cyan";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (settings.panning) {      // Toggles camera to follow player
            this.ctx.save();
            this.ctx.translate(this.canvas.width/2-player.x, this.canvas.height/2-player.y);
        }
        
        // Loop through tile map
        for (var i=0; i<tile_map.tiles.length; i++) {
            for (var j=0; j<tile_map.tiles[1].length; j++) {
                var tile = tile_map.tiles[i][j];
                    if (tile === 1) {       // # 1: Dirt
                        this.ctx.fillStyle = "brown";
                        this.ctx.fillRect(16*j, this.canvas.height-16*(tile_map.tiles.length-i), 16, 16);
                }
            }
        }
        // Show open paths on tile map
        if (settings.hitbox) {
            for (let i=0; i<tile_map.paths.length; i++) {
                this.ctx.fillStyle = "green";
                this.ctx.globalAlpha = 0.5
                //console.log(tile_map.paths[i])
                this.ctx.fillRect(16*tile_map.paths[i][1] + 4, this.canvas.height-16*(tile_map.tiles.length-tile_map.paths[i][0])+4, 8, 8)
                this.ctx.globalAlpha = 1
            }
        }
        
        
        if (this.assets.sprites_loaded) {
            this.animation(settings, player, entities)
        }
        

        // Score
        this.ctx.fillStyle = "rgb(250, 250, 250)";
        this.ctx.font = "24px";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText("Level 1d", 1, 1);
        
        this.ctx.restore();
    }


    animation(settings, player, entities) {
        this.assets.load_frames(player)

        
        if (this.frame_ % player.frame_type[1] === 0 ) {
            player.frame++;
            if (player.frame > player.frame_type[0] - 1) {
                player.frame = 0
            }
        }


        if (this.frame >= 60) {
            this.frame = 0;
        }
        if (this.frame0 >= 6) {
            this.frame0 = 0;
        }
        if (this.frame_ > 60) {
            this.frame++
            this.frame_ = 0
        }
        
        //console.log(player.frame_type)
        //player.atk_time = 4
        if (player.atk.time > 0) {
            if (player.facing_right) {
                this.ctx.drawImage(this.assets.sprite_player, 32 * player.frame + 736, 0, 32, 32, player.x-6, player.y-7, 32, 32);
            }
            else {
                this.ctx.drawImage(this.assets.sprite_player, -32 * player.frame + 128, 32, 32, 32, player.x-12, player.y-7, 32, 32);
            }
        } 

        else if (!player.grounded) {
            if (player.facing_right) {
                this.ctx.drawImage(this.assets.sprite_player, player.frame + 480, 0, 32, 32, player.x-6, player.y-7, 32, 32);
            }
            else {
                this.ctx.drawImage(this.assets.sprite_player, player.frame + 384, 32, 32, 32, player.x-12, player.y-7, 32, 32);
            }
        }
        else if (player.move_time > 0) {
            if (player.facing_right) {
                this.ctx.drawImage(this.assets.sprite_player, 32 * player.frame + 288, 0, 32, 32, player.x-6, player.y-7, 32, 32);
            }
            else {
                this.ctx.drawImage(this.assets.sprite_player, -32 * player.frame + 576, 32, 32, 32, player.x-12, player.y-7, 32, 32);
            }
        }
        else {
            if (player.facing_right) {
                //this.ctx.drawImage(this.assets.sprite_player, 32 * player.frame + 6, 7, 15, 19, player.x, player.y, 15, 19);
                this.ctx.drawImage(this.assets.sprite_player, 32 * player.frame, 0, 32, 32, player.x-6, player.y-7, 32, 32);
            }
            else {
                //this.ctx.drawImage(this.assets.sprite_player, -32 * player.frame + 876, 39, 15, 19, player.x, player.y, 15, 19);
                this.ctx.drawImage(this.assets.sprite_player, -32 * player.frame + 864, 32, 32, 32, player.x-12, player.y-7, 32, 32);
            }
        }

        //this.ctx.drawImage(this.assets.sprite_player, 32 * this.frame0 + 292, 6, 18, 20, player.x, player.y, 18, 20);
        if (settings.hitbox) {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "yellow";
            this.ctx.strokeRect(player.x+0.5, player.y+0.5, player.w, player.h);    
        }

        for (var i=0; i<entities.length; i++) {
            var entity = entities[i];
            this.assets.load_frames_entity(entity)
            if (this.frame_ % entity.frame_type[1] === 0 ) {
                entity.frame++;
                if (entity.frame > entity.frame_type[0] - 1) {
                    entity.frame = 0
                }
            }
            //console.log(entity.frame)
            this.ctx.drawImage(this.assets.slime, 16 * entity.frame, 0, 16, 16, entity.x, entity.y-3, 16, 16)
            if (settings.hitbox) {
                this.ctx.lineWidth = 0.5;
                this.ctx.strokeStyle = "red";
                this.ctx.strokeRect(entity.x+0.5, entity.y+0.5, entity.w, entity.h);
            }
        }

       

        this.frame_++;
        //console.log(player.frame, player.frame_type, this.frame, this.frame_)
    }
}

class Assets {
    constructor(player, entities) {
        this.sprites_loaded = false;
        this.tiles_loaded = false;
        //this.tiles()
        this.sprites();
    }
    
    load_frames(player) {
        player.animation = {        // ['number of frames', 'ticks before next frame']
            idle: [7, 25],
            move: [6, 6],
            jump: [1, 60],
            attack: [5, Math.floor(player.atk.speed/5)]
        };
        if (player.atk.time > 0) {
            if (player.atk.time === player.atk.speed) {player.frame = 0}
            player.frame_type = player.animation.attack
        }
        else if (!player.grounded) {
            if (player.frame_type != player.animation.jump) {player.frame = 0}
            player.frame_type = player.animation.jump}
        else if (player.move_time > 0) {
            player.frame_type = player.animation.move}
        else {
            player.frame_type = player.animation.idle;
        }

    }

    load_frames_entity(slime) {
        slime.animation = {
            idle: [5, 25]
        };
        slime.frame_type = slime.animation.idle
    }

    tiles() {
        // Background
        this.sprite_tile = new Image()
        this.tileImage.src = "assets/tiles/background.png";
        this.tileImage.onload = () => this.tiles_loaded = true;
    }

    sprites() {
        // player image
        this.sprite_player = new Image();
        this.sprite_player.src = "assets/sprites/finn/FinnSprites.png";

        // Monster image
        //this.monsterImage = new Image();
        //this.monsterImage.src = "assets/sprites/monster.png";
        //this.monsterImage.onload = () => this.spritesReady = true;

        this.slime = new Image();
        this.slime.src = "assets/sprites/slime.png";


        this.sprites_loaded = true;
    }
}

