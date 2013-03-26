function rect(x, y, w, h) {
	return { x: x, y: y, w: w, h: h }
}

$("#screen").click(function(e) {
	var imgLeft = $(this).offset().left;
    var clickLeft = e.pageX;
    var x= clickLeft - imgLeft;
    
    var imgTop = $(this).offset().top;
    var clickTop = e.pageY;
    var y = clickTop - imgTop;

	rects.push(rect(x - 10, y - 10, 20, 20));
});

// Represent the level as a list of rectangles
var rects = [
    // platform
	rect(20, 100, 20, 20),
	rect(40, 100, 20, 20),
	rect(60, 100, 20, 20)
]

// horizontal blocks
for(var i = 0; i < 620; i+=20) {
	rects.push(rect(i, 0, 20, 20));
	rects.push(rect(i, 380, 20, 20));
}

for(var i = 0; i < 380; i+=20) {
	rects.push(rect(0, i, 20, 20));
	rects.push(rect(580, i, 20, 20));
}

// Return an object that supports at most "copies" simultaneous playbacks
function createSound(path, copies) {
	var elems = [], index = 0
	for (var i = 0; i < 16; i++) elems.push(new Audio(path))
	return {
		play: function() {
			if (window.chrome) elems[index].load()
			elems[index].play()
			index = (index + 1) % copies
		}
	}
}

// Want to be able to play at most 3 different copies of 'jump.wav' at once
//var jumpSound = createSound('jump.wav', 3)

// Returns true iff a and b overlap
function overlapTest(a, b) {
	return a.x < b.x + b.w && a.x + a.w > b.x &&
		 a.y < b.y + b.h && a.y + a.h > b.y
}

// Move the rectangle p along vx then along vy, but only move
// as far as we can without colliding with a solid rectangle
function move(p, vx, vy) {
  // Move rectangle along x axis
	for (var i = 0; i < rects.length; i++) {
		var c = { x: p.x + vx, y: p.y, w: p.w, h: p.h }
		if (overlapTest(c, rects[i])) {
			if (vx < 0) vx = rects[i].x + rects[i].w - p.x
			else if (vx > 0) vx = rects[i].x - p.x - p.w
		}
	}
	p.x += vx

	// Move rectangle along y axis
	for (var i = 0; i < rects.length; i++) {
		var c = { x: p.x, y: p.y + vy, w: p.w, h: p.h }
		if (overlapTest(c, rects[i])) {
			if (vy < 0) vy = rects[i].y + rects[i].h - p.y
			else if (vy > 0) vy = rects[i].y - p.y - p.h
		}
	}
	p.y += vy
}

// Record which key codes are currently pressed
var keys = {}
document.onkeydown = function (e) { keys[e.which] = true }
document.onkeyup = function (e) { keys[e.which] = false }
var direction = { right: false, left: false, up: false };


// Player is a rectangle with extra properties
var player = rect(20, 20, 26, 34)
player.velocity = { x: 0, y: 0 }
player.onFloor = false

// set initial player img
var img = document.getElementById("player_r");

// Updates the state of the game for the next frame
function update() {
    if ((!!keys[68] - !!keys[65]) != 0) {
        player.velocity.x = 3 * (!!keys[68] - !!keys[65]); // right - left
    }
    else {
        player.velocity.x = 3 * (!!direction.right - !!direction.left); // right - left
    }
	player.velocity.y += 1 // Acceleration due to gravity

	// Move the player and detect collisions
	var expectedY = player.y + player.velocity.y
	move(player, player.velocity.x, player.velocity.y)
	player.onFloor = (expectedY > player.y)
	if (expectedY != player.y) player.velocity.y = 0

	// Only jump when we're on the floor
	if (player.onFloor && (keys[87] || direction.up)) {
		player.velocity.y = -13
		//jumpSound.play()
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
	//c.fillStyle = '#8B4513'
	var blImg = document.getElementById("block");
	for (var i = 0; i < rects.length; i++) {
		var r = rects[i];
		c.drawImage(blImg, r.x, r.y);
		//c.fillRect(r.x, r.y, r.w, r.h)
	}
}

// Set up the game loop
window.onload = function() {
	setInterval(function() {
		update();
		draw();
	}, 1000 / 60);
}