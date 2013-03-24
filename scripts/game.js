function rect(x, y, w, h) {
	return { x: x, y: y, w: w, h: h }
}

function addBlock(event) {
    ///<summary>Add Block to screen on click</summary>
    rects.push(rect(event.offsetX - 10, event.offsetY - 10, 20, 20));
}

// Represent the level as a list of rectangles
var rects = [
    // level
	rect(0, 0, 600, 20),
	rect(0, 0, 20, 500),
	rect(580, 0, 20, 500),
    rect(0, 380, 600, 20),

    // platform
	rect(0, 100, 100, 20),
]

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

// Player is a rectangle with extra properties
var player = rect(20, 20, 20, 20)
player.velocity = { x: 0, y: 0 }
player.onFloor = false

// Updates the state of the game for the next frame
function update() {
	// Update the velocity
	player.velocity.x = 3 * (!!keys[68] - !!keys[65]) // right - left
	player.velocity.y += 1 // Acceleration due to gravity

	// Move the player and detect collisions
	var expectedY = player.y + player.velocity.y
	move(player, player.velocity.x, player.velocity.y)
	player.onFloor = (expectedY > player.y)
	if (expectedY != player.y) player.velocity.y = 0

	// Only jump when we're on the floor
	if (player.onFloor && keys[32]) {
		player.velocity.y = -13
		//jumpSound.play()
	}
}

// Renders a frame
function draw() {
	var c = document.getElementById('screen').getContext('2d')

	// Draw background
	c.fillStyle = '#000'
	c.fillRect(0, 0, c.canvas.width, c.canvas.height)

	// Draw player
	c.fillStyle = '#D00'
	c.fillRect(player.x, player.y, player.w, player.h)

	// Draw levels
	c.fillStyle = '#8B4513'
	for (var i = 0; i < rects.length; i++) {
		var r = rects[i]
		c.fillRect(r.x, r.y, r.w, r.h)
	}
}

// Set up the game loop
window.onload = function() {
	setInterval(function() {
		update()
		draw()
	}, 1000 / 60)
}