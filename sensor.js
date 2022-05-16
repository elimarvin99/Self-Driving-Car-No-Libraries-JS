class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150; //pixels
        this.raySpread = Math.PI / 2; //45 degree angles

        this.rays = [];
        this.readings = [];
    }

    update(roadBorders){
        this.#castRays();
        this.readings = [];
        for(let i = 0; i < this.rays.length; i++){
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        }
    }

    #getReading(ray, roadBorders){
        let touches = [];
        for(let i = 0; i < roadBorders.length; i++){
            const touch = getIntersection(
                ray[0],
                ray[1], 
                roadBorders[i][0], 
                roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }
        if(touches.length == 0){
            return null;
        }else{ //if the ray touches a border, reutn the closest one. how to implement for cars and other objects, not just borders?
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
    }

    #castRays(){
        this.rays = [];
        for(let i = 0; i < this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2, 
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) //ternary accounts for when ray is only one
            ) + this.car.angle; //this makes the angles move with the car
            
            const start = {x:this.car.x, y:this.car.y};
            //this method is wrong and is not populating properly
            const end = {
                x:this.car.x - 
                    Math.sin(rayAngle) * this.rayLength, 
                y:this.car.y - 
                    Math.cos(rayAngle) * this.rayLength
            };
            this.rays.push([start, end]); 
        }
    }

    draw(ctx){
        for(let i = 0; i < this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}