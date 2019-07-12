
window.onload = function() {
    // Getting the 2d context of the canvas element 
    const canvas = document.getElementById("context");
    const context = canvas.getContext("2d");
    
    //building the ball
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
        audio: {
            sfx: document.getElementById("sfx-ball")
        },
        move: function() {
            //moving the ball
            if ( Ball.position.x + Ball.speed.x < Ball.radius ||
                 Ball.position.x + Ball.speed.x > canvas.width - Ball.radius
                ){
                Ball.speed.x = Ball.speed.x*-1;
            }
            if ( Ball.position.y + Ball.speed.y < Paddle.height + Ball.radius 
                ){
                    Ball.speed.y *= -1;

                }else
                    if(Ball.position.y + Ball.speed.y > canvas.height - Ball.radius) {
                        if(Ball.position.x > Paddle.position.x && Ball.position.x < Paddle.position.x + Paddle.width){
                            Ball.speed.y *= -1;
                        }else
                            gameOver();
                }

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
        },
    }
    //Building the paddle
    const Paddle = {
        height: 10,
        width: 75,
        position : {
            x: (canvas.width - 75)/2,
            y: canvas.height - 10,
        },
        direction: 0, // 0 stopped, 1 right, -1 left
        speed : {
            x : 10,
            y : 0
        },
        sprite: "#0095DD",
        draw: function(){
            // drawing the padde
            context.beginPath();
            context.rect(Paddle.position.x, Paddle.position.y, Paddle.width, Paddle.height);
            context.fillStyle = Paddle.sprite;
            context.fill();
            context.closePath();
        },
        move: function() {
            Paddle.position.x += (  (Paddle.position.x + Paddle.speed.x < Paddle.width/2
                                    && Paddle.direction < 0)
                                 || (Paddle.position.x + Paddle.speed.x > canvas.width - Paddle.width
                                    && Paddle.direction > 0) )
                ? 0
                : Paddle.speed.x * Paddle.direction;
        }
    }

    const BricksTemplate = {
        rows: 5,
        columns: 3,
        width: 75,
        height: 20,
        padding: 10,
        offsetTop: 30,
        offsetLeft: 30,
        buildMatrix: function(){
            this.matrix = new Array(this.rows);
            for(let i = 0; i < this.rows; i++){
                this.matrix[i] = new Array(this.columns);
                for(let j = 0; j < this.columns; j++){
                    this.matrix[i][j] = {
                        x: (i*(BricksTemplate.width+BricksTemplate.padding)) + BricksTemplate.offsetLeft,
                        y: (j*(BricksTemplate.height+BricksTemplate.padding)) + BricksTemplate.offsetTop,
                        status: 1
                    }
                }
            }
        }
    }
    BricksTemplate.buildMatrix();
    const Bricks = {
        position: {
            x: 0,
            y: 0
        },
        sprite: "#0095DD",
        audio: {
            sfx: document.getElementById("sfx-brick")
        },
        draw: function() {
            BricksTemplate.matrix.forEach((column) => {
                column.forEach((item) => {
                    if(item.status === 1){
                        context.beginPath();
                        context.rect(item.x, item.y, BricksTemplate.width, BricksTemplate.height);
                        context.fillStyle = Bricks.sprite;
                        context.fill();
                        context.closePath();
                    }
                })
            })
        }
    }

    const Score = {
        count : 0,
        font : "16px Arial",
        sprite : "#0095DD",
        position: {
            x : 20,
            y : 8,
        },
        draw : function(){
            context.beginPath();
            context.fillStyle = this.sprite;
            context.fillText(`Score: ${this.count}`, this.position.x, this.position.y);
            context.closePath();
            if(Score.count === BricksTemplate.columns * BricksTemplate.rows)
                win();
        } 
        
    }

    const Tips = {
        font: "24px Arial",
        sprite : "#0095DD", 
        position: {
            x : canvas.width - canvas.width/2,
            y : 8,
        },
        draw : function() {
            context.beginPath();
            context.fillStyle = this.sprite;
            context.fillText("Use mouse or Arrow to play(<--/ -->)", this.position.x, this.position.y);
            context.closePath();
        }
    }

    // draw the screen
    const draw = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#e1e1e1";
        context.fill();
        context.closePath();
        Ball.draw();
        Paddle.draw();
        Bricks.draw();
        Score.draw();
        Tips.draw();
        checkCollision();
        Ball.move();
        requestAnimationFrame(draw)

    }

    const keyDownHandler = function(evt) {
        if(evt.key === "Left" || evt.key === "ArrowLeft")
            Paddle.direction = -1
        if(evt.key === "Right" || evt.key === "ArrowRight")
            Paddle.direction = 1;
        Paddle.move();
    }

    const keyUpHandler = function(evt) {
        Paddle.direction = 0;
    }

    const mouseMoveHandler = function(evt) {
        const relativeX =  Number(evt.clientX) - canvas.offsetLeft;
        if (relativeX  > Paddle.width/2  && relativeX < (canvas.width - Paddle.width/2)) {
            Paddle.position.x = relativeX - Paddle.width/2;
            Paddle.direction = ( evt.movementX > 0 ) 
                                ? 1 
                                : (evt.movementX < 0)
                                     ? -1 
                                     : 0;
        }
    }

    const checkCollision = function() {
        BricksTemplate.matrix.forEach((column) => {
            column.forEach((item) => {
                if(( Ball.position.x > item.x && Ball.position.x < item.x + BricksTemplate.width)
                    && Ball.position.y > item.y && Ball.position.y < item.y + BricksTemplate.height
                    && item.status === 1)
                    {
                        Ball.speed.y *= -1;
                        item.status = 0;
                        Score.count++;
                        if(Ball.speed.y < 20 || Ball.speed.y > -20)
                            Ball.speed.y++;
                    }
            })
        })
    }

    const gameOver = function() {
        alert("Game Over");
        document.location.reload();
    }

    const win = function() {
        alert("You win");
        document.location.reload();
    }
 
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    draw();
}