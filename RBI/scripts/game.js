var res = {};

$(function () {
	res.gameComplete = false;
	res.gameOver = false;
	res.rects = [];
	res.spikes = [];
	res.rectsCreated = [];
	res.GAME_END = 10;
	res.INITIAL_BLOCKS = 10;
	res.diam = null;
	res.snake = null;
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
function spike(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function snakeEnemy(x, y, w, h) {
	return { x: x, y: y, w: w, h: h };
}
function fishEnemy(x, y, w, h) {
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
				y > res.rectsCreated[i].y && y < res.rectsCreated[i].y + res.rectsCreated[i].h)
			{
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


// starts and resets the game
function startGame() {
	document.getElementById('levelNum').innerHTML = res.level == -1 ? "fish" : res.level;

	res.blockCount = res.INITIAL_BLOCKS;
	document.getElementById("blockNum").innerText = res.blockCount;

	setLevelBlocks();

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


// starts the res.fish res.level variety
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
	// initial platform for res.player
	res.rects.push(rect(20, 100, 20, 20));
	res.rects.push(rect(40, 100, 20, 20));

	// horizontal blocks and res.spikes
	for (var i = 0; i < 620; i += 20) {
		res.rects.push(rect(i, 0, 20, 20));
		if (i > 500 || i < 20) {
			res.rects.push(rect(i, 380, 20, 20));
		}
		else {
			res.spikes.push(spike(i, 380, 20, 20));
		}
	}

	// vertical blocks
	for (var i = 0; i < 380; i += 20) {
		res.rects.push(rect(0, i, 20, 20));
		res.rects.push(rect(580, i, 20, 20));
	}

	switch (res.level) {
		default:
			for (var  i = 0; i < 12;  i++)
			{
				var x = Math.floor((Math.random()*10)+3) *40;
				var y = Math.floor((Math.random()*9)+2) *30;
				
				res.rects.push(rect(x, y, 20, 20));
			}
			
			res.diam = diamond(560, 360, 20, 20);
			break;
		case 9:
			res.rects.push(rect(180, 260, 20, 20));
			res.rects.push(rect(200, 260, 20, 20));
			res.rects.push(rect(220, 260, 20, 20));
			res.rects.push(rect(240, 260, 20, 20));
			res.rects.push(rect(260, 260, 20, 20));
			res.rects.push(rect(280, 260, 20, 20));
			res.rects.push(rect(300, 260, 20, 20));
			res.rects.push(rect(320, 260, 20, 20));
			res.rects.push(rect(340, 260, 20, 20));
			res.rects.push(rect(360, 260, 20, 20));

			res.snake = snakeEnemy(320, 245, 30, 15);
			res.diam = diamond(560, 360, 20, 20);
			break;
		case 10:
			res.rects.push(rect(120, 180, 20, 20));
			res.spikes.push(spike(120, 160, 20, 20));

			res.rects.push(rect(200, 280, 20, 20));
			res.spikes.push(spike(200, 260, 20, 20));

			res.rects.push(rect(200, 100, 20, 20));
			res.spikes.push(spike(200, 80, 20, 20));

			res.rects.push(rect(280, 180, 20, 20));
			res.spikes.push(spike(280, 160, 20, 20));

			res.rects.push(rect(360, 100, 20, 20));
			res.spikes.push(spike(360, 80, 20, 20));

			res.rects.push(rect(360, 280, 20, 20));
			res.spikes.push(spike(360, 260, 20, 20));

			res.rects.push(rect(440, 180, 20, 20));
			res.spikes.push(spike(440, 160, 20, 20));
			res.diam = diamond(560, 360, 20, 20);
			break;
	}
}


function setFishBlocks() {
	// initial platform for res.player
	res.rectsCreated.push(rect(20, 100, 20, 20));
	res.rectsCreated.push(rect(40, 100, 20, 20));

	// horizontal blocks and res.spikes
	for (var i = 0; i < 620; i += 20) {
		res.rects.push(rect(i, 0, 20, 20));
		if (i > 560 || i < 20) {
			res.rects.push(rect(i, 380, 20, 20));
		}
		else {
			res.spikes.push(spike(i, 380, 20, 20));
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


// returns true if and only if a and b overlap
function overlap(a, b) {
	return a.x < b.x + b.w && a.x + a.w > b.x &&
		 a.y < b.y + b.h && a.y + a.h > b.y;
}


function overlapEnemy(a, b) {
	return a.x < b.x - 15 + b.w && a.x + a.w > b.x + 15 &&
		 a.y < b.y + b.h && a.y + a.h > b.y;
}


// move the res.player p along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function moveplayer(p, vx, vy) {
	// move res.player along x axis and check created blocks
	for (var i = 0; i < res.rects.length; i++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
		if (overlap(c, res.rects[i])) {
			if (vx < 0) {
				vx = res.rects[i].x + res.rects[i].w - p.x;
			}
			else if (vx > 0) {
				vx = res.rects[i].x - p.x - p.w;
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
			else if (vx > 0) {
				vx = res.rectsCreated[i].x - p.x - p.w;
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

	// spike collisions
	for (var n = 0; n < res.spikes.length; n++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h };
		if (overlap(c, res.spikes[n])) {
			res.gameOver = true;
		}
	}
	
	// res.snake collision
	if (res.snake != null) {
		if (overlap(c, res.snake)) {
			res.gameOver = true;
		}
	}
}


// move the res.snake enemy along vx then along vy, but only move
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
			else if (vx > 0) {
				vx = res.rects[i].x - p.x - p.w;
				res.snake.velocity.x *= -1;
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
			else if (vy > 0) {
				vy = res.rects[i].y - p.y - p.h;
			}
		}
		else
		{
			res.snake.velocity.x *= -1;
		}
	}
	//p.y += vy;
}


// move the res.fish and destory blocks that collide
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


// set the left button move event
function left(e,bool) {
	if(e.target.localName != 'select'){
		e.preventDefault(); 
	}
	res.direction.left = bool;
}


// set the right button move event
function right(e,bool) {
	if(e.target.localName != 'select'){
		e.preventDefault(); 
	}
	res.direction.right = bool;
}


// set the jump button move event
function jump(e,bool) {
	if(e.target.localName != 'select'){
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
	if (res.snake != null) {
		moveEnemy(res.snake, res.snake.velocity.x, res.snake.velocity.y);
	}
	res.player.onFloor = (expectedY > res.player.y);
	if (expectedY != res.player.y) {
		res.player.velocity.y = 0;
	}

	// Only jump when we're on the floor
	if (res.player.onFloor && (res.keys[87] || res.direction.up)) {
		res.player.velocity.y = -13;
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
	c.fillStyle = res.level == -1 ? '#000090' : '#000';
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

	// draw spikes
	var sImg = document.getElementById('spike');
	for (var n = 0; n < res.spikes.length; n++) {
		var s = res.spikes[n];
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

	if (res.gameComplete) {
		if (res.level == res.GAME_END) {
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
	res.spikes = [];
	res.snake = null;
	startGame();

	document.getElementById('scoreLevel').innerHTML = 'level: ';

	document.getElementById('reset').disabled = false;
	document.getElementById('reset').style.display = 'inline';
}


// start the fish level
function fishLevel() {
	res.rects = [];
	res.fish = [];
	res.rectsCreated = [];
	res.spikes = [];
	res.snake = null;
	res.diam = null;
	res.level = -1;
	startFishGame();

	document.getElementById('scoreLevel').innerHTML = 'score: ';

	document.getElementById('reset').disabled = true;
	document.getElementById('reset').style.display = 'none';
}


// reset the player position for a level reset
function reset() {
	res.rectsCreated = [];

	res.gameComplete = false;
	res.gameOver = false;

	res.player = rect(20, 20, 26, 34);
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
	startGame();
};