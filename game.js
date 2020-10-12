
let

// Game variables //

canvas,
ctx,
width,
height,
floorHeight,

bgColor = "#858585",
bgIndex1 = 0,
bgIndex2 = 0,
bgIndex3 = 0,

frames = 0,
score = 0,
best = localStorage.getItem("best") || 0,

//Ore placement

goldL = [],
goldM = [],
goldS = [],

rockL = [],
rockM = [],
rockS = [],

diamond = []


// State variables //

currentstate,
states = {
	Start: 0, Init: 1, Game: 2, Score: 3
},

// Game objects //

/**
 * Ok button initiated in main()
 */
startBtn

/**
 * The bird
 */
bird = {

	x: 60,
	y: 0,

	frame: 0,
	velocity: 0,
	animation: [0, 1, 2, 1], // animation sequence

	rotation: 0,
	radius: 12,

	gravity: 0.25,
	_jump: 4.6,

	/**
	 * Makes the bird "flap" and jump
	 */
	jump: function() {
		this.velocity = -this._jump;
	},

	/**
	 * Update sprite animation and position of bird
	 */
	update: function() {
		// make sure animation updates and plays faster in gamestate
		let n = currentstate === states.Start ? 10 : 5;
		this.frame += frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length;

		// in Start state make bird hover up and down and set
		// rotation to zero
		if (currentstate === states.Start) {

			this.y = height - 280 + 5*Math.cos(frames/10);
			this.rotation = 0;

		} else { // game and score state //

			this.velocity += this.gravity;
			this.y += this.velocity;

			// change to the score state when bird touches the ground
			if (this.y >= height - s_fg.height-10) {
				this.y = height - s_fg.height-10;
				if (currentstate === states.Game) {
					currentstate = states.Score;
				}
				// sets velocity to jump speed for correct rotation
				this.velocity = this._jump;
			}

			// when bird lack upward momentum increment the rotation
			// angle
			if (this.velocity >= this._jump) {

				this.frame = 1;
				this.rotation = Math.min(Math.PI/2, this.rotation + 0.3);

			} else {

				this.rotation = -0.3;

			}
		}
	},

	/**
	 * Draws bird with rotation to canvas ctx
	 * 
	 * @param  {CanvasRenderingContext2D} ctx the context used for
	 *                                        drawing
	 */
	draw: function(ctx) {
		ctx.save();
		// translate and rotate ctx coordinatesystem
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		
		let n = this.animation[this.frame];
		// draws the bird with center in origo
		s_bird[n].draw(ctx, -s_bird[n].width/2, -s_bird[n].height/2);

		ctx.restore();
	}
};

let Mineral = function () {
	x = 0;
	y = 0;

	price =  0;
	wight = 0;

	sprite = null;
};
Mineral.prototype.update = function() {

};

Mineral.prototype.draw = function(ctx) {
	if (this.sprite != null) {
		this.sprite.draw(ctx, this.x, this.y);
	}
};

let Gold_S = function () {
	Mineral.apply(this, arguments);
	price =  25;
	wight = 10;
};

Gold_S.prototype = Mineral.prototype;
Gold_S.prototype.constructor = Gold_S;

let Gold_M = function () {
	Mineral.apply(this, arguments);
	price =  50;
	wight = 30;
};

Gold_M.prototype = Mineral.prototype;
Gold_M.prototype.constructor = Gold_M;

let Gold_L = function () {
	Mineral.apply(this, arguments);
	price =  150;
	wight = 50;
};

Gold_L.prototype = Mineral.prototype;
Gold_L.prototype.constructor = Gold_L;

let Rock_S = function () {
	Mineral.apply(this, arguments);
	price =  5;
	wight = 10;
};

Rock_S.prototype = Mineral.prototype;
Rock_S.prototype.constructor = Rock_S;

let Rock_M = function () {
	Mineral.apply(this, arguments);
	price =  15;
	wight = 30;
};

Rock_M.prototype = Mineral.prototype;
Rock_M.prototype.constructor = Rock_M;

let Rock_L = function () {
	Mineral.apply(this, arguments);
	price =  25;
	wight = 50;
};

Rock_L.prototype = Mineral.prototype;
Rock_L.prototype.constructor = Rock_L;

let Diamond = function () {
	Mineral.apply(this, arguments);
	price =  250;
	wight = 5;
};

Diamond.prototype = Mineral.prototype;
Diamond.prototype.constructor = Diamond;

/**
 * Starts and initiate the game
 */
function main() {
	// create canvas and set width/height
	canvas = document.createElement("canvas");

	onResize();
	window.addEventListener("resize", onResize);

	canvas.style.border = "1px solid #000";
	
	// listen for input event
	document.addEventListener("touchstart", onInputPress);
	document.addEventListener("mousedown", onInputPress);
	
	if (!(!!canvas.getContext && canvas.getContext("2d"))) {
		alert("Your browser doesn't support HTML5, please update to latest version");
	}
	ctx = canvas.getContext("2d");
	
	currentstate = states.Init;
	// append canvas to document
	document.body.appendChild(canvas);
	
	// initate graphics and startBtn
	let img = new Image();

	//img.canvas = canvas;
	img.onload = function () {
		//console.log(this);
		initSprites(this);
		ctx.fillStyle = bgColor;
		
		startBtn = {
			x: 0,
			y: 0,
			width: s_buttons.start.width,
			height: s_buttons.start.height
		}

		startBtn.x = (canvas.width - s_buttons.start.width)/2,
		startBtn.y = canvas.height - 200,
		//console.log(startBtn)
		
		run();
	}
	img.src = "img/msp_sprite_sheet.png";
	console.log("Canvas setup");
}

/**
 * Starts and update gameloop
 */
function run() {
	let loop = function() {
		update();
		render();
		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}

/**
 * Update forground, bird and pipes position
 */
function update() {
	frames++;
	if (currentstate === states.Init) {
		gameInit();
	}else if (currentstate === states.Game) {
		pipes.update();
	} else if (currentstate === states.Score) {
		
	} else {
		// set best score to maximum score
		best = Math.max(best, score);
		localStorage.setItem("best", best);
	}
	

	bird.update();
}

function gameInit(){
	bgIndex1 = getRandomInt(0, s_bg1.length-1);
	bgIndex2 = getRandomInt(0, s_bg2.length-1);
	bgIndex3 = getRandomInt(0, s_bg3.length-1);
	
	floorHeight =  height - s_bg3[bgIndex3].height - s_bg2[bgIndex2].height - s_bg1[bgIndex1].height;

	// Big minerals
	let count = getRandomInt(1, 3);
	goldL = getMineralLocations(sizeX,sizeY,count);
	let count = getRandomInt(1, 3);
	rockL = getMineralLocations(sizeX,sizeY,count);
	
	// Medium minerals
	count = getRandomInt(3, 7);
	goldM = getMineralLocations(sizeX,sizeY,count);
	count = getRandomInt(3, 7);
	rockM = getMineralLocations(sizeX,sizeY,count);

	// Small minerals
	count = getRandomInt(7, 15);
	goldS = getMineralLocations(sizeX,sizeY,count);
	count = getRandomInt(7, 15);
	rockS = getMineralLocations(sizeX,sizeY,count);

	// Diamonds
	count = getRandomInt(0, 5);	
	diamond = getMineralLocations(sizeX,sizeY,count);
	
	currentstate = states.Start;

}

function getMineralLocations(sizeX,sizeY,count){
	let locations = [];
	for(let i = 0; i < count; i++){
		locations.push([getRandomInt(0,width),getRandomInt(0,height-floorHeight)]);
	}
	console.log(locations)
	return locations;
}

/**
 * Draws bird and all pipes and assets to the canvas
 */
function render() {
	// draw background color
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, width, height);
	// draw background sprites
	
	//console.log(height +" - " + s_bg3[bgIndex3].height + " - " + s_bg2[bgIndex2].height + " - " + s_bg1[bgIndex1].height)

	s_bg1[bgIndex1].drawBackGround(ctx, 0, floorHeight ); 
	s_bg2[bgIndex2].drawBackGround(ctx, 0, floorHeight + s_bg1[bgIndex1].height); // + X Für debug
	s_bg3[bgIndex3].drawBackGround(ctx, 0, height - s_bg3[bgIndex3].height);

	s_entrance.draw(ctx, (width-s_entrance.width)/2, floorHeight - s_entrance.height - 4);
	
	ctx.fillStyle = "#000";
	ctx.fillRect(0, floorHeight - 10, width, 10);


	
	/*
	pipes.draw(ctx);
	bird.draw(ctx);

	// draw forground sprites
	s_fg.draw(ctx, fgpos, height - s_fg.height);
	s_fg.draw(ctx, fgpos+s_fg.width, height - s_fg.height);

	let width2 = width/2; // center of canvas

	if (currentstate === states.Start) {
		// draw Start text and sprite to canvas
		s_splash.draw(ctx, width2 - s_splash.width/2, height - 300);
		s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width/2, height-380);

	}
	if (currentstate === states.Score) {
		// draw gameover text and score board
		s_text.GameOver.draw(ctx, width2 - s_text.GameOver.width/2, height-400);
		s_score.draw(ctx, width2 - s_score.width/2, height-340);
		s_buttons.Ok.draw(ctx, startBtn.x, startBtn.y);
		// draw score and best inside the score board
		s_numberS.draw(ctx, width2-47, height-304, score, null, 10);
		s_numberS.draw(ctx, width2-47, height-262, best, null, 10);

	} else {
		// draw score to top of canvas
		s_numberB.draw(ctx, null, 20, score, width2);

	}
	*/
}

/**
 * Called on mouse or touch press. Update and change state
 * depending on current game state.
 * 
 * @param  {MouseEvent/TouchEvent} evt tho on press event
 */
function onInputPress(evt) {

	switch (currentstate) {

		// change state and update bird velocity
		case states.Start:
			currentstate = states.Game;
			bird.jump();
			break;

		// update bird velocity
		case states.Game:
			bird.jump();
			break;

		// change state if event within startBtn bounding box
		case states.Score:
			// get event position
			let mx = evt.offsetX, my = evt.offsetY;

			if (mx == null || my == null) {
				mx = evt.touches[0].clientX;
				my = evt.touches[0].clientY;
			}

			// check if within
			if (startBtn.x < mx && mx < startBtn.x + startBtn.width &&
				startBtn.y < my && my < startBtn.y + startBtn.height
			) {
				pipes.reset();
				currentstate = states.Start;
				score = 0;
			}
			break;

	}
}

/**
 * Resizes the canvas to use the max available space while keeping a 16/9 screen ratio 
 */
function onResize(){

	//console.log("Window resize")

	width = window.innerWidth;
	height = window.innerHeight;

	//console.log(width);
	//console.log(height);

	let canvasRatio = 16/9;

	if((height * canvasRatio) > width) {
		height = width / canvasRatio;
		width = height * canvasRatio;
	}

	if((width / canvasRatio) > height) {
		width = height * canvasRatio;
		height = width / canvasRatio;
	}

	canvas.width = width;
	canvas.height = height;

	//console.log(width +" / "+height + " = " + (width / height) );
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}