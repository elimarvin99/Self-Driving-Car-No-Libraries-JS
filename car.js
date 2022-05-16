class Car{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
    }

    //this method draws the car on the canvas, with x being the center of the car that has height and width extending in both directions in pixels
    draw(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        //the car is drawn as a rectangle
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();

        this.sensor.draw(ctx);
    }
    #move(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        //accounts for max speed
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed / 2){
            this.speed =- this.maxSpeed / 2;
        }
        //uses friction value to slow down the car
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){ //reverse, negative speed
            this.speed += this.friction;
        } 
        //cause car to completely stop when speed is less than friction, otherwise friction will cause speed to be above 0 causing it to move slowly
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        if(this.speed != 0){
            const flip = this.speed > 0 ? 1 : -1;
            //the flip will only work in reverse (negative), because otherwise it's just the angle times itself (positive 1).
            if(this.controls.left){
                this.angle += 0.03 * flip;
            }
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
        }
        

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }
}