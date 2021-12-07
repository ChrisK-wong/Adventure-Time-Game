class Entity {
    constructor(x=0, y=0, width=0, height=0, speed=0, fall_speed=0, hp=null, atk=null) {
        this.x = x;             // x location
        this.y = y;             // y location
        this.w = width;         // hitbox width
        this.h = height;        // hitbox height
        this.name = name;
        this.speed = speed;     // movement in pixels per second
        this.fall_speed = fall_speed;
        this.hp = hp;           // health
        this.grounded = false;
        this.fall_time = 0;
        this.move_time = 0;
        this.jump_height = 0.015;
        this.facing_right = true;
        this.animation = {};
        this.frame = 0;         // animation frame
        this.atk = {
            time: 0,
            damage: 0,          // atk damage
            speed: 0,           // speed of attack in game ticks
            cooldown: 0,        // game ticks before being able to attack again
            cooldown_time: 0

        }
    }
}


class Player extends Entity{
    constructor(...args) {
        super(...args);
        this.atk = {
            time: 0,
            damage: 5,
            speed: 30,
            cooldown: 4,
            cooldown_time: 0
        }
    }

    jump() {
        this.y -= parseInt(15 * Math.abs(this.fall_time) * this.jump_height)
    }

    attack() {
        this.atk.time--;
    }
    update(modifier) {
        var modifier_x = modifier
        if ((("KeyA" in keysDown) || ("KeyD" in keysDown)) && !("KeyA" in keysDown && "KeyD" in keysDown)) {
            this.move_time++;
        }
        else {
            this.move_time = 0;
        }
        //console.log(this.move_time)
        // if ("KeyW" in keysDown) { // Player holding up
        //     this.y -= parseInt(this.speed * modifier);
        // }
        if ("KeyS" in keysDown) { // Player holding down
            this.y += Math.floor(this.speed * modifier);
        }
        if ("KeyA" in keysDown && !("KeyD" in keysDown)) { // Player holding left
            this.x -= Math.floor(this.speed * modifier_x);
            this.facing_right = false;
            
        }
        if ("KeyD" in keysDown && !("KeyA" in keysDown)) { // Player holding right
            this.x += Math.floor(this.speed * modifier_x);
            this.facing_right = true;
        }

        if ("Space" in keysDown && jumpable) { // Player presses space
            jumpable = false;
            if (this.grounded) {
                this.fall_time = -20
            }
        }
        if (this.fall_time < 0) {
            this.jump()
        }
        if (this.atk.time > 0) {
            this.attack()
        }
        if (this.atk.cooldown_time > 0) {
            this.atk.cooldown_time--;
        }

        if (mouseEvent) {           // Player clicks
            if (this.atk.cooldown_time == 0) {
                this.atk.time = this.atk.speed
                this.atk.cooldown_time = this.atk.time + this.atk.cooldown
            }
            mouseEvent = false
        
        }
    }

}

class Monster extends Entity{
    constructor(...args) {
        super(...args);
        this.path_x = this.x;
        this.tick = 0
    }

    check_path(paths) {
        let x = Math.floor(this.x / 16);
        let y = Math.floor((this.y - this.h)/ 16) - 1;
        //console.log(paths)
        console.log(y, x)
        for (let i=0; i<paths.length; i++) {
            if (paths[i][0] == y && paths[i][1] == x) {
                return [y, x];
            }
        }
        return -1;
    }


    linearAI(paths) {
        // Convert x and y pos to index in matrix
        let path = this.check_path(paths);
        console.log(path)
        if (path == -1) {
            return;
        }
        let y = path[0];
        let x = path[1];
        let x_paths = [];
        for (let i=0; i<paths.length; i++) {
            if (paths[i][0] == y) {
                x_paths.push(paths[i][1])
            }
        }
        let left_x = x;
        let left_bound = x * 16;

        // Get left tile boundary
        while (x_paths.includes(left_x-1)) {
            left_bound -= 16;
            left_x--;
        }
        let right_x = x;
        let right_bound = x * 16 + 16 - this.w;
        while (x_paths.includes(right_x+1)) {
            right_bound += 16;
            right_x++;
        }
        return Math.floor(Math.random() * (right_bound - left_bound) + left_bound);
    }

    update(modifier, paths) {
        console.log(this.check_path(paths))

        if (this.x == this.path_x && Math.random() < 0.004) {
            this.path_x = this.linearAI(paths);
        }

        if (this.x < this.path_x) {
            this.x += Math.floor(this.speed * modifier);
        }
        if (this.x > this.path_x) {
            this.x -= Math.floor(this.speed * modifier);
        }
    }
}