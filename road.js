class Road{
    //centered around an x value and have a width
    constructor(x, width, laneCount = 3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top =- infinity;
        this.bottom = infinity;

        const topLeft = {x:this.left, y:this.top};
        const topRight = {x:this.right, y:this.top};
        const bottomLeft = {x:this.left, y:this.bottom};
        const bottomRight = {x:this.right, y:this.bottom};
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    //this method gets the lane center to place the car properly
    getLaneCenter(laneIndex){
        //gets the width of each lane
        const laneWidth = this.width / this.laneCount;
        //divided by 2 so the car is in the center of the lane
        return this.left + laneWidth / 2 + 
        //accounts for car to always be on the last lane and never off the screen
        Math.min(laneIndex, this.laneCount - 1) * laneWidth; 
    }

    //this method draws the road
    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for(let i = 1; i <= this.laneCount - 1; i++){
            //the x coordinate of each lane/line depends on the amount of lanes
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            );

            ctx.setLineDash([20,20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
        
    }
}