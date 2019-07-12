const canvas = document.getElementById("context");
const Ball = {
    position: {
        x: canvas.width/2,
        y: canvas.height-30
    },
    radius: 10,
    speed: {
        x: 1,
        y: -1
    },
    sprite: "#0095DD",
    move: function() {
        //moving the ball
        if ( Ball.position.x + Ball.speed.x < Ball.radius ||
             Ball.position.x + Ball.speed.x > canvas.width - Ball.radius
            )
            Ball.speed.x = Ball.speed.x*-1;

        if ( Ball.position.y + Ball.speed.y < Ball.radius ||
             Ball.position.y + Ball.speed.y > canvas.height - Ball.radius
            )
            Ball.speed.y = Ball.speed.y*-1;
            
            Ball.position.x += Ball.speed.x,
            Ball.position.y += Ball.speed.y
    },
    draw: function() {
        // drawing the ball
        context.beginPath();
        context.arc(Ball.position.x, Ball.position.y, Ball.radius, 0, Math.PI*2);
        context.fillStyle = Ball.sprite;
        context.fill();
        context.closePath();
    }
}

export default Ball;