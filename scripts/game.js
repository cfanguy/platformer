var gameComplete = false, gameOver = false;
var rects = [], spikes = [], rectsCreated = [];
var diam = diamond(560, 360, 20, 20);
var snake = snakeEnemy(420, 285, 30,15);
var player;
var level;
var blockCount;

// Record which key codes are currently pressed
var keys = {};
document.onkeydown = function (e) { keys[e.which] = true; };
document.onkeyup = function (e) { keys[e.which] = false; };
var direction = { right: false, left: false, up: false };

// set initial player img
var img = document.getElementById("player_r");

function rect(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}
function rectCreated(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}
function diamond(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}
function spike(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}
function snakeEnemy(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}


// set the mouse click event to create blocks
function setClickEvent() {
    $("#screen").click(function (e) {
        if (blockCount > 0) {
            blockCount--;
            document.getElementById("blockNum").innerText = blockCount;

            var imgLeft = $(this).offset().left;
            var clickLeft = e.pageX;
            var x = clickLeft - imgLeft;

            var imgTop = $(this).offset().top;
            var clickTop = e.pageY;
            var y = clickTop - imgTop;

            rectsCreated.push(rectCreated(x - 10, y - 10, 20, 20));
        }
    });
}


// starts and resets the game
function startGame() {
    blockCount = 10;
    document.getElementById("blockNum").innerText = blockCount;

    setLevelBlocks();

    gameComplete = false;
    gameOver = false;

    player = rect(20, 20, 26, 34);
    player.velocity = { x: 0, y: 0 };
    player.onFloor = false;
    
    snake.velocity = { x: 0, y: 0 };
    snake.velocity.x = -2;
    snake.velocity.y = 1;

    // initial platform for player
    rects.push(rect(20, 100, 20, 20));
    rects.push(rect(40, 100, 20, 20));
    rects.push(rect(60, 100, 20, 20));

    // horizontal blocks and spikes
    for (var i = 0; i < 620; i += 20) {
        rects.push(rect(i, 0, 20, 20));
        if (i > 500 || i < 20) {
            rects.push(rect(i, 380, 20, 20));
        }
        else {
            spikes.push(spike(i, 380, 20, 20));
        }
    }

    // vertical blocks
    for (var i = 0; i < 380; i += 20) {
        rects.push(rect(0, i, 20, 20));
        rects.push(rect(580, i, 20, 20));
    }

    // set the elements
    var l = document.getElementById('left');
    var r = document.getElementById('right');
    var j = document.getElementById('jump');

    // add touch events to each element
    l.addEventListener('touchstart', function (event) { left(event, true); }, false);
    l.addEventListener('touchend', function (event) { left(event, false); }, false);
    r.addEventListener('touchstart', function (event) { right(event, true); }, false);
    r.addEventListener('touchend', function (event) { right(event, false); }, false);
    j.addEventListener('touchstart', function (event) { jump(event, true); }, false);
    j.addEventListener('touchend', function (event) { jump(event, false); }, false);
}


function setLevelBlocks() {
    switch (level) {
        case 1:
            rects.push(rect(120, 300, 20, 20));
            rects.push(rect(140, 300, 20, 20));
            rects.push(rect(160, 300, 20, 20));

            rects.push(rect(260, 100, 20, 20));
            rects.push(rect(280, 100, 20, 20));
            rects.push(rect(300, 100, 20, 20));

            rects.push(rect(400, 300, 20, 20));
            rects.push(rect(420, 300, 20, 20));
            rects.push(rect(440, 300, 20, 20));
            break;
        case 2:
            rects.push(rect(110, 330, 20, 20));
            rects.push(rect(170, 320, 20, 20));

            rects.push(rect(255, 160, 20, 20));
            rects.push(rect(280, 155, 20, 20));
            rects.push(rect(305, 160, 20, 20));

            rects.push(rect(290, 315, 20, 20));
            rects.push(rect(330, 320, 20, 20));
            rects.push(rect(370, 310, 20, 20));

            rects.push(rect(370, 220, 20, 20));
            rects.push(rect(420, 200, 20, 20));
            rects.push(rect(470, 220, 20, 20));
            break;
        case 3:
            rects.push(rect(120, 180, 20, 20));
            spikes.push(spike(120, 160, 20, 20));

            rects.push(rect(200, 280, 20, 20));
            spikes.push(spike(200, 260, 20, 20));

            rects.push(rect(200, 100, 20, 20));
            spikes.push(spike(200, 80, 20, 20));

            rects.push(rect(280, 180, 20, 20));
            spikes.push(spike(280, 160, 20, 20));

            rects.push(rect(360, 100, 20, 20));
            spikes.push(spike(360, 80, 20, 20));

            rects.push(rect(360, 280, 20, 20));
            spikes.push(spike(360, 260, 20, 20));

            rects.push(rect(440, 180, 20, 20));
            spikes.push(spike(440, 160, 20, 20));
            break;
    }
}


// returns true if and only if a and b overlap
function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}


function overlapEnemy(a, b) {
    return a.x < b.x - 15 + b.w && a.x + a.w > b.x + 15 &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}


// move the player p along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function movePlayer(p, vx, vy) {
    // move player along x axis and check created blocks
    for (var i = 0; i < rects.length; i++) {
            var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
            if (overlap(c, rects[i])) {
                if (vx < 0)
                    vx = rects[i].x + rects[i].w - p.x;
                    else if (vx > 0)
                        vx = rects[i].x - p.x - p.w;
            }
            if (overlap(c, diam)) {
                gameComplete = true;
            }
    }
    for (var i = 0; i < rectsCreated.length; i++) {
            var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
            if (overlap(c, rectsCreated[i])) {
                if (vx < 0)
                    vx = rectsCreated[i].x + rectsCreated[i].w - p.x;
                    else if (vx > 0)
                        vx = rectsCreated[i].x - p.x - p.w;
            }
    }
    p.x += vx;

    // move player along y axis and check created blocks
    for (var i = 0; i < rects.length; i++) {
            var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
            if (overlap(c, rects[i])) {
                if (vy < 0)
                    vy = rects[i].y + rects[i].h - p.y;
                    else if (vy > 0)
                        vy = rects[i].y - p.y - p.h;
            }
            if (overlap(c, diam)) {
                gameComplete = true;
            }
    }
    for (var i = 0; i < rectsCreated.length; i++) {
            var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
            if (overlap(c, rectsCreated[i])) {
                if (vy < 0)
                    vy = rectsCreated[i].y + rectsCreated[i].h - p.y;
                    else if (vy > 0)
                        vy = rectsCreated[i].y - p.y - p.h;
            }
            if (overlap(c, diam)) {
                gameComplete = true;
            }
    }
    p.y += vy;

    // spike collisions
    for (var n = 0; n < spikes.length; n++) {
        var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
        if (overlap(c, spikes[n])) {
            gameOver = true;
        }
    }
    
    // snake collision
    if (overlap(c, snake)) {
        gameOver = true;
    }
}


// move the enemy along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function moveEnemy(p, vx, vy) {
    // remove the created rectangle that collided with the enemy
    for (var i = 0; i < rectsCreated.length; i++) {
        var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
        if(overlap(c, rectsCreated[i]))
            rectsCreated.splice(i, 1);
    }
    
    // move enemy along x axis
    for (var i = 0; i < rects.length; i++) {
        var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
        if (overlapEnemy(c, rects[i])) {
            if (vx < 0) {
                vx = rects[i].x + rects[i].w - p.x;
                snake.velocity.x *= -1;
            }
            else if (vx > 0) {
                vx = rects[i].x - p.x - p.w;
                snake.velocity.x *= -1;
            }
        }
    }
    p.x += vx;

    // move enemy along y axis
    for (var i = 0; i < rects.length; i++) {
        var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
        if (overlapEnemy(c, rects[i])) {
            if (vy < 0) {
                vy = rects[i].y + rects[i].h - p.y;
            }
            else if (vy > 0) {
                vy = rects[i].y - p.y - p.h;
            }
        }
        else
        {
            snake.velocity.x *= -1;
        }
    }
    //p.y += vy;
}


// set the left button move event
function left(e,bool) {
    if(e.target.localName != 'select'){
        e.preventDefault(); 
    }
    direction.left = bool;
}


// set the right button move event
function right(e,bool) {
    if(e.target.localName != 'select'){
        e.preventDefault(); 
    }
    direction.right = bool;
}


// set the jump button move event
function jump(e,bool) {
    if(e.target.localName != 'select'){
        e.preventDefault(); 
    }
    direction.up= bool;
}

// Updates the state of the game for the next frame
function update() {
    if ((!!keys[68] - !!keys[65]) != 0) {
        player.velocity.x = 3 * (!!keys[68] - !!keys[65]); // right - left
    }
    else {
        player.velocity.x = 3 * (!!direction.right - !!direction.left); // right - left
    }
    player.velocity.y += 1; // Acceleration due to gravity

    // Move the player and detect collisions
    var expectedY = player.y + player.velocity.y;
    movePlayer(player, player.velocity.x, player.velocity.y);
    moveEnemy(snake, snake.velocity.x, snake.velocity.y);
    player.onFloor = (expectedY > player.y);
    if (expectedY != player.y) {
        player.velocity.y = 0;
    }

    // Only jump when we're on the floor
    if (player.onFloor && (keys[87] || direction.up)) {
        player.velocity.y = -13;
    }
}


// Renders a frame
function draw() {
    var c = document.getElementById('screen').getContext('2d');

    // Draw background
    c.fillStyle = '#000';
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);

    // Draw player
    if (player.velocity.x > 0)
            img = document.getElementById("player_r");
    else
        if (player.velocity.x < 0)
            img = document.getElementById("player_l");
    c.drawImage(img, player.x - 6, player.y - 5);

    // Draw levels
    var blImg = document.getElementById("block");
    for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        c.drawImage(blImg, r.x, r.y);
    }
    
    for (var i = 0; i < rectsCreated.length; i++) {
        var r = rectsCreated[i];
        c.drawImage(blImg, r.x, r.y);
    }

    // draw diamond
    var dImg = document.getElementById('diamond');
    c.drawImage(dImg, diam.x, diam.y);

    // draw spikes
    var sImg = document.getElementById('spike');
    for (var n = 0; n < spikes.length; n++) {
        var s = spikes[n];
        c.drawImage(sImg, s.x, s.y);
    }
    // draw snake
    var snImg = document.getElementById('snake_l');
    var snRImg = document.getElementById('snake_r');
    if(snake.velocity.x > 0) {
        c.drawImage(snRImg, snake.x, snake.y);
    }
    else {
        c.drawImage(snImg, snake.x, snake.y);  
    }

    if (gameComplete) {
        if (level == 3) {
            var cImg = document.getElementById('complete');
            c.drawImage(cImg, 100, 60);
        }
        else {
            var cImg = document.getElementById('next_level');
            c.drawImage(cImg, 100, 60);
            level++;

            setTimeout(reset, 1500);
        }
    };

    if (gameOver) {
        var gImg = document.getElementById('gameover');
        c.drawImage(gImg, 100, 60);

        var dImg = document.getElementById('player_dead');
        c.drawImage(dImg, player.x - 6, player.y - 5);
    };
}


// reset the game
function reset() {
    rects = [];
    rectsCreated = [];
    spikes = [];
    startGame();
}


// Set up the game loop
window.onload = function () {
    level = 1;

    setInterval(function () {
        if (gameComplete == false && gameOver == false) {
            update();
            draw();
        }
	}, 1000 / 60);

    setClickEvent();
    startGame();
};