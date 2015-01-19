// http://msdn.microsoft.com/en-US/library/ie/hh673557.aspx#feedback

var res = {};

$(function () {
	res.gameComplete = false;
	res.gameOver = false;
	res.lavaCheck1 = true;
	res.lavaCheck2 = true;
	res.rects = [];
	res.killblocks = [];
	res.rectsCreated = [];
	res.GAME_END_CAVE = 10;
	res.GAME_END_LAVA = 20;
	res.GAME_END_MINE = 30;
	res.INITIAL_BLOCKS = 10;
	res.diam = null;
	res.snake = null;
	res.lavaB_1 = null;
	res.lavaB_2 = null;
	res.fish = [];
	res.player;
	res.level;
	res.blockCount;
	res.score = 0;

	// Record which key codes are currently pressed
	res.keys = {};
	document.onkeydown = function (e) { res.keys[e.which] = true; };
	document.onkeyup = function (e) { res.keys[e.which] = false; };
	res.direction = { right: false, left: false, up: false };

	// set initial player img
	res.img = document.getElementById("player_r");
});


function rect(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function rectCreated(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function diamond(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function killblock(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function snakeEnemy(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function fishEnemy(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function lavaBall(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}


// set the mouse click event to create blocks
function setClickEvent() {
	$("#screen").click(function (e) {
		var createBlock = true;

		var imgLeft = $(this).offset().left;
		var clickLeft = e.pageX;
		var x = clickLeft - imgLeft;
		var blockX = x - 10;

		var imgTop = $(this).offset().top;
		var clickTop = e.pageY;
		var y = clickTop - imgTop;
		var blockY = y - 10;

		for (var i = 0; i < res.rectsCreated.length; i++) {
			if (x > res.rectsCreated[i].x && x < res.rectsCreated[i].x + res.rectsCreated[i].w &&
				y > res.rectsCreated[i].y && y < res.rectsCreated[i].y + res.rectsCreated[i].h) {
				res.blockCount++;
				document.getElementById("blockNum").innerText = res.blockCount;
				createBlock = false;
				res.rectsCreated.splice(i, 1);
			}
		}

		if (res.blockCount > 0 && createBlock) {
			res.blockCount--;
			document.getElementById("blockNum").innerText = res.blockCount;

			res.rectsCreated.push(rectCreated(blockX, blockY, 20, 20));
		}
	});
}


// starts the fish level variety
function startFishGame() {
    document.getElementById('levelNum').innerHTML = res.level == -1 ? "res.fish" : res.level;

    res.blockCount = res.INITIAL_BLOCKS;
    document.getElementById("blockNum").innerText = res.blockCount;

    setFishBlocks();

    res.gameComplete = false;
    res.gameOver = false;

    res.player = rect(20, 20, 26, 34);
    res.player.velocity = { x: 0, y: 0 };
    res.player.onFloor = false;

    addEvents();
}


// starts the cave level variety
function startCaveGame() {
	document.getElementById('levelNum').innerHTML = res.level == -1 ? "fish" : res.level;

	res.blockCount = res.INITIAL_BLOCKS;
	document.getElementById("blockNum").innerText = res.blockCount;

	setCaveBlocks();

	res.gameComplete = false;
	res.gameOver = false;

	res.player = rect(20, 20, 26, 34);
	res.player.velocity = { x: 0, y: 0 };
	res.player.onFloor = false;
	
	if (res.snake != null) {
		res.snake.velocity = { x: 0, y: 0 };
		res.snake.velocity.x = -2;
		res.snake.velocity.y = 1;
	}

	addEvents();
}


// starts the lava level variety
function startLavaGame() {
    document.getElementById('levelNum').innerHTML = res.level == -1 ? "fish" : res.level;

    res.blockCount = res.INITIAL_BLOCKS;
    document.getElementById("blockNum").innerText = res.blockCount;

    setLavaBlocks();

    res.gameComplete = false;
    res.gameOver = false;

    res.player = rect(20, 20, 26, 34);
    res.player.velocity = { x: 0, y: 0 };
    res.player.onFloor = false;

    if (res.lavaB_1 == null) {
        res.lavaB_1 = new lavaBall(220, 382, 20, 20);
        res.lavaB_1.velocity = { x: 0, y: 0 };
        res.lavaB_1.velocity.x = 0;
        res.lavaB_1.velocity.y = 0;
    }
    if (res.lavaB_2 == null) {
        res.lavaB_2 = new lavaBall(400, 382, 20, 20);
        res.lavaB_2.velocity = { x: 0, y: 0 };
        res.lavaB_2.velocity.x = 0;
        res.lavaB_2.velocity.y = 0;
    }

    addEvents();
}


// starts the mine level variety
function startMineGame() {
    document.getElementById('levelNum').innerHTML = res.level == -1 ? "fish" : res.level;

    res.blockCount = res.INITIAL_BLOCKS;
    document.getElementById("blockNum").innerText = res.blockCount;

    setMineBlocks();

    res.gameComplete = false;
    res.gameOver = false;

    res.player = rect(20, 250, 26, 34);
    res.player.velocity = { x: 0, y: 0 };
    res.player.onFloor = false;

    if (res.snake != null) {
        res.snake.velocity = { x: 0, y: 0 };
        res.snake.velocity.x = -3;
        res.snake.velocity.y = 1;
    }

    addEvents();
}


// add mouse events
function addEvents() {
    // set the elements
    var l = document.getElementById('left');
    var r = document.getElementById('right');
    var j = document.getElementById('jump');

    // add touch events to each element
    l.addEventListener('pointerdown', function (event) { left(event, true); event.preventDefault(); }, false);
    l.addEventListener('pointerup', function (event) { left(event, false); event.preventDefault(); }, false);
    r.addEventListener('pointerdown', function (event) { right(event, true); event.preventDefault(); }, false);
    r.addEventListener('pointerup', function (event) { right(event, false); event.preventDefault(); }, false);
    j.addEventListener('pointerdown', function (event) { jump(event, true); event.preventDefault(); }, false);
    j.addEventListener('pointerup', function (event) { jump(event, false); event.preventDefault(); }, false);
}


function setFishBlocks() {
    // initial platform for player
    res.rectsCreated.push(rect(20, 100, 20, 20));
    res.rectsCreated.push(rect(40, 100, 20, 20));

    // horizontal blocks and killblocks
    for (var i = 0; i < 620; i += 20) {
        res.rects.push(rect(i, 0, 20, 20));
        if (i > 560 || i < 20) {
            res.rects.push(rect(i, 380, 20, 20));
        }
        else {
            res.killblocks.push(killblock(i, 380, 20, 20));
        }
    }

    // vertical blocks
    for (var i = 0; i < 380; i += 20) {
        res.rects.push(rect(0, i, 20, 20));
        res.rects.push(rect(580, i, 20, 20));
    }

    res.fish.push(fishEnemy(200, 200, 25, 25));
    res.fish[0].velocity = { x: 0, y: 0 };
    res.fish.push(fishEnemy(300, 220, 25, 25));
    res.fish[1].velocity = { x: 0, y: 0 };
    res.fish.push(fishEnemy(400, 200, 25, 25));
    res.fish[2].velocity = { x: 0, y: 0 };
}


function setCaveBlocks() {
    // use level data from levels_desktop.js
    for (var n = 0; n < level.cave[res.level - 1].length; n++) {
        for (var i = 0; i < level.cave[res.level - 1][n].length; i++) {
            switch (level.cave[res.level - 1][n][i]) {
                case "+":
                    res.rects.push(rect(i * 20, n * 20, 20, 20));
                    break;
                case "-":
                    break;
                case "^":
                    res.killblocks.push(killblock(i * 20, n * 20, 20, 20));
                    break;
            }
        }

        res.diam = diamond(560, 360, 20, 20);
    }
}


function setLavaBlocks() {
    // initial platform for player
    res.rects.push(rect(20, 100, 20, 20));
    res.rects.push(rect(40, 100, 20, 20));

    // horizontal blocks and killblocks
    for (var i = 0; i < 620; i += 20) {
        res.rects.push(rect(i, 0, 20, 20));
        if (i > 520 || i < 20) {
            res.rects.push(rect(i, 380, 20, 20));
        }
        else {
            res.killblocks.push(killblock(i, 380, 20, 20));
        }
    }

    // vertical blocks
    for (var i = 0; i < 380; i += 20) {
        res.rects.push(rect(0, i, 20, 20));
        res.rects.push(rect(580, i, 20, 20));
    }

    switch (res.level) {
        default:
            for (var i = 0; i < 8; i++) {
                var x, y;

                x = Math.floor((Math.random() * 10) + 3) * 40;
                y = Math.floor((Math.random() * 9) + 2) * 30;

                // do not set blocks on these x coordinates
                if ((x > 185 && x < 255) || (x >= 365 && x <= 435)) {
                    i--;
                }
                else {
                    res.rects.push(rect(x, y, 20, 20));
                }
            }

            res.diam = diamond(560, 360, 20, 20);
            break;
        case 20:
            res.rects.push(rect(200, 100, 20, 20));
            res.rects.push(rect(360, 100, 20, 20));

            res.diam = diamond(560, 360, 20, 20);
            break;
    }
}


function setMineBlocks() {
    res.rects.push(rect(20, 300, 20, 20));
    res.rects.push(rect(40, 300, 20, 20));
    res.rects.push(rect(40, 300, 20, 20));

    // horizontal blocks and killblocks
    for (var i = 0; i < 620; i += 20) {
        res.rects.push(rect(i, 380, 20, 20));
        if (i != 580 && i != 0) {
            res.killblocks.push(killblock(i, 0, 20, 20));
        }
    }

    // vertical blocks
    for (var i = 0; i < 380; i += 20) {
        res.rects.push(rect(0, i, 20, 20));
        res.rects.push(rect(580, i, 20, 20));
    }

    if (res.level < 30)
    {
        for (var i = 0; i < 8; i++) {
            var x = Math.floor((Math.random() * 10) + 2) * 40;
            var y = Math.floor((Math.random() * 9) + 2) * 30;

            res.rects.push(rect(x, y, 20, 20));
        }
    }

    res.snake = snakeEnemy(160, 365, 30, 15);

    res.rects.push(rect(520, 100, 20, 20));
    res.rects.push(rect(540, 100, 20, 20));
    res.rects.push(rect(560, 100, 20, 20));
    res.diam = diamond(560, 80, 20, 20);
}


// returns true if and only if a and b overlap
function overlap(a, b) {
	return a.x < b.x + b.w && a.x + a.w > b.x &&
		 a.y < b.y + b.h && a.y + a.h > b.y;
}


function overlapEnemy(a, b) {
    if (res.level > 20)
    {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
		    a.y < b.y + b.h && a.y + a.h > b.y;
    }
    else
    {
        return a.x < b.x - 15 + b.w && a.x + a.w > b.x + 15 &&
		    a.y < b.y + b.h && a.y + a.h > b.y;
    }
}


// move the player p along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function moveplayer(p, vx, vy) {
	// move res.player along x axis and check created blocks
	for (var i = 0; i < res.rects.length; i++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
		if (overlap(c, res.rects[i])) {
		    if (vx < 0) {
		        vx = res.rects[i].x + res.rects[i].w - p.x;
		    }
		    else {
		        if (vx > 0) {
		            vx = res.rects[i].x - p.x - p.w;
		        }
		    }
		}
		if (res.diam != null) {
			if (overlap(c, res.diam)) {
				res.gameComplete = true;
			}
		}
	}
	for (var i = 0; i < res.rectsCreated.length; i++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
		if (overlap(c, res.rectsCreated[i])) {
		    if (vx < 0) {
		        vx = res.rectsCreated[i].x + res.rectsCreated[i].w - p.x;
		    }
		    else {
		        if (vx > 0) {
		            vx = res.rectsCreated[i].x - p.x - p.w;
		        }
		    }
		}
	}
	p.x += vx;

	// move res.player along y axis and check created blocks
	for (var i = 0; i < res.rects.length; i++) {
			var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
			if (overlap(c, res.rects[i])) {
				if (vy < 0) {
					vy = res.rects[i].y + res.rects[i].h - p.y;
				}
				else if (vy > 0) {
					vy = res.rects[i].y - p.y - p.h;
				}
			}
			if (res.diam != null) {
				if (overlap(c, res.diam)) {
					res.gameComplete = true;
				}
			}
	}
	for (var i = 0; i < res.rectsCreated.length; i++) {
		var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
		if (overlap(c, res.rectsCreated[i])) {
			if (vy < 0) {
				vy = res.rectsCreated[i].y + res.rectsCreated[i].h - p.y;
			}
			else if (vy > 0) {
				vy = res.rectsCreated[i].y - p.y - p.h;
			}
		}
		if (res.diam != null) {
			if (overlap(c, res.diam)) {
				res.gameComplete = true;
			}
		}
	}
	p.y += vy;

	// killblock collisions
	for (var n = 0; n < res.killblocks.length; n++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
		if (overlap(c, res.killblocks[n])) {
			res.gameOver = true;
		}
	}
	
	// res.snake collision
	if (res.snake != null) {
		if (overlap(c, res.snake)) {
			res.gameOver = true;
		}
	}

    // lavaB_1 collision
	if (res.lavaB_1 != null) {
	    if (overlap(c, res.lavaB_1)) {
	        res.gameOver = true;
	    }
	}

    // lavaB_2 collision
	if (res.lavaB_2 != null) {
	    if (overlap(c, res.lavaB_2)) {
	        res.gameOver = true;
	    }
	}
}


// move the snake enemy along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function moveEnemy(p, vx, vy) {
	// remove the created rectangle that collided with the enemy
	for (var i = 0; i < res.rectsCreated.length; i++) {
		var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
		if(overlap(c, res.rectsCreated[i]))
			res.rectsCreated.splice(i, 1);
	}
	
	// move enemy along x axis
	for (var i = 0; i < res.rects.length; i++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
		if (overlapEnemy(c, res.rects[i])) {
		    if (vx < 0) {
		        vx = res.rects[i].x + res.rects[i].w - p.x;
		        res.snake.velocity.x *= -1;
		    }
		    else {
		        if (vx > 0) {
		            vx = res.rects[i].x - p.x - p.w;
		            res.snake.velocity.x *= -1;
		        }
		    }
		}
	}
	p.x += vx;

	// move enemy along y axis
	for (var i = 0; i < res.rects.length; i++) {
		var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
		if (overlapEnemy(c, res.rects[i])) {
		    if (vy < 0) {
		        vy = res.rects[i].y + res.rects[i].h - p.y;
		    }
		    else {
		        if (vy > 0) {
		            vy = res.rects[i].y - p.y - p.h;
		        }
		    }
		}
		else {
			res.snake.velocity.x *= -1;
		}
	}
}


// move the fish and destroy blocks that collide
function moveFish(p, vx, vy) {
	// remove the created rectangle that collided with the enemy
	for (var i = 0; i < res.rectsCreated.length; i++) {
		var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
		if (overlap(c, res.rectsCreated[i]))
			res.rectsCreated.splice(i, 1);
	}

	// move enemy along x axis
	for (var i = 0; i < res.rects.length; i++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
	}
	p.x += vx;

	// move enemy along y axis
	for (var i = 0; i < res.rects.length; i++) {
		var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
	}
	p.y += vy;
}


// move the lava ball vertically and destroy blocks that collide
function moveLavaB(p, vx, vy) {
    // remove the created rectangle that collided with the enemy
    for (var i = 0; i < res.rectsCreated.length; i++) {
        var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
        if (overlap(c, res.rectsCreated[i]))
            res.rectsCreated.splice(i, 1);
    }

    // move enemy along y axis
    for (var i = 0; i < res.rects.length; i++) {
        var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h };
    }
    p.y += vy;

    if (p.y < 40) {
        p.velocity.y = 3;
    }
    else {
        if (p.y > 380) {
            p.velocity.y = 0;
        }
    }
}


// set the left button move event
function left(e,bool) {
	if(e.target.localName != 'select') {
		e.preventDefault(); 
	}
	res.direction.left = bool;
}


// set the right button move event
function right(e,bool) {
	if(e.target.localName != 'select') {
		e.preventDefault(); 
	}
	res.direction.right = bool;
}


// set the jump button move event
function jump(e,bool) {
	if(e.target.localName != 'select') {
		e.preventDefault(); 
	}
	res.direction.up = bool;
}


// updates the state of the game for the next frame
function update() {
	if ((!!res.keys[68] - !!res.keys[65]) != 0) {
		res.player.velocity.x = 3 * (!!res.keys[68] - !!res.keys[65]); // right - left
	}
	else {
		res.player.velocity.x = 3 * (!!res.direction.right - !!res.direction.left); // right - left
	}
	if (res.level == -1) {
		res.player.velocity.y += 0.2;
	}
	else {
		res.player.velocity.y += 1; // Acceleration due to gravity
	}

	// Move the res.player and detect collisions
	var expectedY = res.player.y + res.player.velocity.y;
	moveplayer(res.player, res.player.velocity.x, res.player.velocity.y);
	res.player.onFloor = (expectedY > res.player.y);
	if (expectedY != res.player.y) {
		res.player.velocity.y = 0;
	}

	// Only jump when we're on the floor
	if (res.player.onFloor && (res.keys[87] || res.direction.up)) {
		res.player.velocity.y = -13;
	}

	if (res.snake != null) {
	    moveEnemy(res.snake, res.snake.velocity.x, res.snake.velocity.y);
	}
	if (res.lavaB_1 != null) {
	    moveLavaB(res.lavaB_1, res.lavaB_1.velocity.x, res.lavaB_1.velocity.y);
	    if (res.lavaB_1.velocity.y == 0 && res.lavaCheck1) {
	        setTimeout(function () { res.lavaB_1.velocity.y = -3; res.lavaCheck1 = true; }, Math.random() * 4500);
	        res.lavaCheck1 = false;

	    }
	}
	if (res.lavaB_2 != null) {
	    moveLavaB(res.lavaB_2, res.lavaB_2.velocity.x, res.lavaB_2.velocity.y);
	    if (res.lavaB_2.velocity.y == 0 && res.lavaCheck2) {
	        setTimeout(function () { res.lavaB_2.velocity.y = -3; res.lavaCheck2 = true; }, Math.random() * 4500);
	        res.lavaCheck2 = false;
	    }
	}

	if (res.level == -1) {
		for (var i = 0; i < res.fish.length; i++) {
			if (res.player.x < res.fish[i].x - (i * 6 + i)) {
				res.fish[i].velocity.x = -1;
			}
			else {
				res.fish[i].velocity.x = 1;
			}
			if (res.player.y < res.fish[i].y - (i * 6 + i)) {
				res.fish[i].velocity.y = -1;
			}
			else {
				res.fish[i].velocity.y = 1;
			}
			moveFish(res.fish[i], res.fish[i].velocity.x, res.fish[i].velocity.y);
		}

		res.score++;
		document.getElementById('levelNum').innerHTML = res.score;
	}
}


// renders a frame
function draw() {
	var c = document.getElementById('screen').getContext('2d');

    // draw background
	if (res.level == -1) {
	    c.fillStyle = '#000090'
	}
	else {
	    if (res.level >= 1 && res.level <= 10) {
	        c.fillStyle = '#020202'
	    }
	    else if (res.level >= 11 && res.level <= 20) {
	        c.fillStyle = '#200000'
	    }
	    else
	    {
	        c.fillStyle = '#121212'
	    }
	}
	c.fillRect(0, 0, c.canvas.width, c.canvas.height);

	// draw player
	if (!res.gameOver) {
		if (res.player.velocity.x > 0)
			res.img = document.getElementById("player_r");
		else
			if (res.player.velocity.x < 0)
				res.img = document.getElementById("player_l");
		c.drawImage(res.img, res.player.x - 6, res.player.y - 5);
	}

	// draw res.levels
	var blImg = document.getElementById("block");
	for (var i = 0; i < res.rects.length; i++) {
		var r = res.rects[i];
		c.drawImage(blImg, r.x, r.y);
	}
	
	// draw created blocks
	var crImg = document.getElementById("created");
	for (var i = 0; i < res.rectsCreated.length; i++) {
		var r = res.rectsCreated[i];
		c.drawImage(crImg, r.x, r.y);
	}

	// draw diamond
	var dImg = document.getElementById('diamond');
	if (res.diam != null) {
		c.drawImage(dImg, res.diam.x, res.diam.y);
	}

    // draw killblocks
	var sImg;
	if (res.level < 11) {
	    sImg = document.getElementById('spike');
	}
	else if (res.level < 21) {
	    sImg = document.getElementById('lava');
	}
	else
	{
	    sImg = document.getElementById('spikes_down');
	}
	for (var n = 0; n < res.killblocks.length; n++) {
	    var s = res.killblocks[n];
		c.drawImage(sImg, s.x, s.y);
	}
	// draw snake
	var snImg = document.getElementById('snake_l');
	var snRImg = document.getElementById('snake_r');
	if (res.snake != null) {
		if (res.snake.velocity.x > 0) {
			c.drawImage(snRImg, res.snake.x, res.snake.y);
		}
		else {
			c.drawImage(snImg, res.snake.x, res.snake.y);
		}
	}
	// draw fish
	var fImg = document.getElementById('fish_l');
	var fRImg = document.getElementById('fish_r');
	if (res.fish.length > 0) {
		for (var i = 0; i < res.fish.length; i++) {
			if (res.fish[i].velocity.x > 0) {
				c.drawImage(fRImg, res.fish[i].x, res.fish[i].y);
			}
			else {
				c.drawImage(fImg, res.fish[i].x, res.fish[i].y);
			}
		}
	}
    // draw lava balls
	var lbImg = document.getElementById('lava_ball');
	if (res.lavaB_1 != null) {
	    c.drawImage(lbImg, res.lavaB_1.x, res.lavaB_1.y);
	}
	if (res.lavaB_2 != null) {
	    c.drawImage(lbImg, res.lavaB_2.x, res.lavaB_2.y);
	}

	if (res.gameComplete) {
	    if (res.level == res.GAME_END_CAVE || res.level == res.GAME_END_LAVA || res.level == res.GAME_END_MINE) {
			var cImg = document.getElementById('complete');
			c.drawImage(cImg, 100, 60);
		}
		else {
			var cImg = document.getElementById('next_level');
			c.drawImage(cImg, 100, 60);
			res.level++;

			setTimeout(nextLevel, 1500);
		}
	};

	if (res.gameOver) {
	    var gImg;
	    if (res.level != -1) {
	        gImg = document.getElementById('gameOver');
	    }
	    else {
	        gImg = document.getElementById('gameOverFish');
	    }
		c.drawImage(gImg, 100, 60);

		var dImg = document.getElementById('player_dead');
		c.drawImage(dImg, res.player.x - 6, res.player.y - 5);
	};
}


// reset the game
function nextLevel() {
	res.rects = [];
	res.fish = [];
	res.rectsCreated = [];
	res.killblocks = [];
	res.snake = null;
	res.lavaB_1 = null;
	res.lavaB_2 = null;

	if (res.level < 11)
	{
	    startCaveGame();
	}
	else if (res.level > 10 && res.level < 21)
	{
	    startLavaGame();
	}
	else
	{
	    startMineGame();
	}

	document.getElementById('scoreLevel').innerHTML = 'Level: ';

	document.getElementById('reset').style.display = 'inline';
}


// start the fish level
function fishLevel() {
	res.rects = [];
	res.fish = [];
	res.rectsCreated = [];
	res.killblocks = [];
	res.snake = null;
	res.diam = null;
	res.lavaB_1 = null;
	res.lavaB_2 = null;
	res.level = -1;
	res.score = 0;
	document.getElementById('levelNum').innerHTML = 0;
	startFishGame();

	document.getElementById('scoreLevel').innerHTML = 'Score: ';

	document.getElementById('reset').style.display = 'none';
}


// start the lava levels
function lavaLevel() {
    res.rects = [];
    res.fish = [];
    res.rectsCreated = [];
    res.killblocks = [];
    res.snake = null;
    res.diam = null;
    res.lavaB_1 = null;
    res.lavaB_2 = null;
    res.level = 11;
    startLavaGame();

    document.getElementById('scoreLevel').innerHTML = 'Level: ';

    document.getElementById('reset').style.display = 'inline';
}


// start the mine levels
function mineLevel() {
    res.rects = [];
    res.fish = [];
    res.rectsCreated = [];
    res.killblocks = [];
    res.snake = null;
    res.diam = null;
    res.lavaB_1 = null;
    res.lavaB_2 = null;
    res.level = 21;
    startMineGame();

    document.getElementById('scoreLevel').innerHTML = 'Level: ';

    document.getElementById('reset').style.display = 'inline';
}


// reset the player position for a level reset
function resetLevel() {
	res.rectsCreated = [];

	res.gameComplete = false;
	res.gameOver = false;

	if (res.level < 21)
	{
	    res.player = rect(20, 20, 26, 34);
	}
	else
	{
	    res.player = rect(20, 250, 26, 34);
	}

	res.player.velocity = { x: 0, y: 0 };
	res.player.onFloor = false;

	res.blockCount = res.INITIAL_BLOCKS;
	document.getElementById("blockNum").innerText = res.blockCount;
}


// Set up the game loop
window.onload = function () {
    res.level = 1;

    setInterval(function () {
        if (res.gameComplete == false && res.gameOver == false) {
            update();
            draw();
        }
    }, 1000 / 60);

    setClickEvent();
    startCaveGame();
};