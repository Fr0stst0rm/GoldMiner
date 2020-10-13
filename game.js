
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
gameTimer = 0,
daltaTime = 0,
startTime = 0,
endTime = 0,
score = 0,
best = localStorage.getItem("best") || 0,

//Minerals

minerals = [],


// State variables //

currentstate,
states = {
	Start: 0, Init: 1, Game: 2, Score: 3
},

// Game objects //

hook = {

	x: 0,
	y: 0,

	length: 0,
	speed: 0,
	rotation: 0,
	baseRotSpeed: 1.5,
	rotSpeed: 1.5,

	capturedMineralIndex: -1,

	/**
	 * Makes the bird "flap" and jump
	 */
	fire: function() {
		if(this.speed == 0){
			this.speed = 150;
			this.baseRotSpeed = this.rotSpeed;
			this.rotSpeed = 0;
		}
	},

	/**
	 * Update sprite animation and position of bird
	 */
	update: function() {
		
		if (currentstate === states.Game) {

			this.rotation += this.rotSpeed * daltaTime;

			if(Math.abs(this.rotation) >= (Math.PI/2)){
				this.rotSpeed = -this.rotSpeed;
			}

			if(this.speed != 0){
				this.length += this.speed * daltaTime;

				//Calc Vector
				let vec = [0, (s_rope.height + this.length)];
				//Rotate
				vec = [Math.cos(this.rotation)*vec[0] - Math.sin(this.rotation)*vec[1],Math.sin(this.rotation)*vec[0] + Math.cos(this.rotation)*vec[1]];
				//Translate
				vec[0] += this.x;
				vec[1] += this.y;
				if(this.capturedMineralIndex == -1){
					//Check for collision
					for(let i = 0; i < minerals.length; i++){
						if(minerals[i].intersects(vec[0] , vec[1])){
							console.log("Hit some rock with index " + i + " @ " + vec);
							this.capturedMineralIndex = i;
							this.speed = -this.speed;
							break;
						}
					}
				} else {
					minerals[this.capturedMineralIndex].x = vec[0] - (minerals[this.capturedMineralIndex].sprite.width/2);
					minerals[this.capturedMineralIndex].y = vec[1] - (minerals[this.capturedMineralIndex].sprite.height/2);
				}
			}
			
			if(this.length < 0){
				this.length = 0;
				this.speed = 0;
				this.rotSpeed = this.baseRotSpeed;

				if(this.capturedMineralIndex > -1){
					score += minerals[this.capturedMineralIndex].value;
					minerals.splice(this.capturedMineralIndex, 1);
					this.capturedMineralIndex = -1;
				}
			}

			if((this.length > (Math.pow(Math.pow(width / 2, 2) + Math.pow((height - floorHeight), 2), 0.5))) && (this.speed > 0)){
				this.speed = -this.speed;
			}

			//console.log(this.length);

		} else {
			this.speed = 0;
		}
	},

	draw: function(ctx) {
		ctx.save();
		// translate and rotate ctx coordinatesystem
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		
		// draws the rope with center in origo
		s_rope.drawScaled(ctx, -s_rope.width/2, 0, 0, (s_rope.height + this.length));

		ctx.restore();
	}
};

let Mineral = function () {
	this.x = 0;
	this.y = 0;

	this.value =  0;
	this.wight = 0;

	this.sprite = null;
	this.test = 1;
};

Mineral.prototype.update = function() {

};

Mineral.prototype.intersects = function(x,y) {

	if((this.x <= x) && ((this.x + this.sprite.width) >= x) && (this.y <= y) && ((this.y + this.sprite.height) >= y)){
		return true;
	}

	return false;
};

Mineral.prototype.draw = function(ctx) {
	//console.log(this)
	if (this.sprite != null) {
		this.sprite.draw(ctx, this.x, this.y);
	}
};

let Gold_S = function () {
	Mineral.apply(this, arguments);
	this.value =  25;
	this.wight = 10;
	this.sprite = s_gold_s;
};

Gold_S.prototype = Mineral.prototype;
Gold_S.prototype.constructor = Gold_S;

let Gold_M = function () {
	Mineral.apply(this, arguments);
	this.value =  50;
	this.wight = 30;
	this.sprite = s_gold_m;
};

Gold_M.prototype = Mineral.prototype;
Gold_M.prototype.constructor = Gold_M;

let Gold_L = function () {
	Mineral.apply(this, arguments);
	this.value =  150;
	this.wight = 50;
	this.sprite = s_gold_l;
};

Gold_L.prototype = Mineral.prototype;
Gold_L.prototype.constructor = Gold_L;

let Rock_S = function () {
	Mineral.apply(this, arguments);
	this.value =  5;
	this.wight = 10;
	this.sprite = s_rock_s;
};

Rock_S.prototype = Mineral.prototype;
Rock_S.prototype.constructor = Rock_S;

let Rock_M = function () {
	Mineral.apply(this, arguments);
	this.value =  15;
	this.wight = 30;
	this.sprite = s_rock_m;
};

Rock_M.prototype = Mineral.prototype;
Rock_M.prototype.constructor = Rock_M;

let Rock_L = function () {
	Mineral.apply(this, arguments);
	this.value =  25;
	this.wight = 50;
	this.sprite = s_rock_l;
};

Rock_L.prototype = Mineral.prototype;
Rock_L.prototype.constructor = Rock_L;

let Diamond = function () {
	Mineral.apply(this, arguments);
	this.value =  250;
	this.wight = 5;
	this.sprite = s_diamond;
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
	
	currentstate = states.Start;
	// append canvas to document
	document.body.appendChild(canvas);
	
	// initate graphics and startBtn
	let img = new Image();

	//img.canvas = canvas;
	img.onload = function () {
		//console.log(this);
		initSprites(this);
		ctx.fillStyle = bgColor;
		ctx.font = "50px Arial";

		startBtn = {
			x: 0,
			y: 0,
			width: s_buttons.start.width,
			height: s_buttons.start.height
		}

		bgIndex1 = getRandomInt(0, s_bg1.length-1);
		bgIndex2 = getRandomInt(0, s_bg2.length-1);
		bgIndex3 = getRandomInt(0, s_bg3.length-1);
		
		floorHeight =  s_entrance.height + 33;
		
		hook.x = (width-s_rope.width) / 2;
		hook.y = floorHeight - 10;
		
		
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
		if((minerals.length == 0) || (gameTimer <= 0)){
			currentstate = states.Score;
			gameTimer = 0;
		}

		endTime = new Date();
		daltaTime = (endTime - startTime) / 1000;
		gameTimer -= daltaTime;
		startTime = new Date();

	} else if (currentstate === states.Score) {
		best = Math.max(best, score);
		localStorage.setItem("best", best);	
	}

	hook.update();
}

function gameInit(){

	bgIndex1 = getRandomInt(0, s_bg1.length-1);
	bgIndex2 = getRandomInt(0, s_bg2.length-1);
	bgIndex3 = getRandomInt(0, s_bg3.length-1);
	
	floorHeight =  s_entrance.height + 33;

	minerals = [];

	// Big minerals
	let count = getRandomInt(1, 3);
	placeMinerals(Gold_L,count);
	count = getRandomInt(1, 3);
	placeMinerals(Rock_L,count);
	
	// Medium minerals
	count = getRandomInt(3, 7);
	placeMinerals(Gold_M,count);
	count = getRandomInt(3, 7);
	placeMinerals(Rock_M,count);

	// Small minerals
	count = getRandomInt(7, 15);
	placeMinerals(Gold_S,count);
	count = getRandomInt(7, 15);
	placeMinerals(Rock_S,count);

	// Diamonds
	count = getRandomInt(0, 5);	
	placeMinerals(Diamond,count);

	//console.log(minerals);

	score = 0;

	gameTimer = 50;
	startTime = new Date();

	currentstate = states.Game;

}

function placeMinerals(mineralClass,count,){
	for(let i = 0; i < count; i++){
		let mineral = new mineralClass();
	
		//console.log(mineral);

		mineral.x = getRandomInt(0,width - mineral.sprite.width);
		mineral.y = getRandomInt(floorHeight,height- mineral.sprite.height);

		minerals.push(mineral);
	}
}

/**
 * Draws bird and all pipes and assets to the canvas
 */
function render() {
	// draw background color
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, width, height);
	// draw background sprites
	
	let pitHeight = (height - floorHeight) / 3;

	let bgHeight = Math.max(floorHeight, floorHeight + (pitHeight * 1) - (pitHeight / 2));
	ctx.fillStyle = s_bg1[bgIndex1].topColor;
	ctx.fillRect(0, floorHeight, width, pitHeight/2);
	ctx.fillStyle = s_bg1[bgIndex1].bottomColor;
	ctx.fillRect(0, bgHeight, width, pitHeight/2 );
	s_bg1[bgIndex1].drawBackGround(ctx, 0, bgHeight - (s_bg1[bgIndex1].height/2), width );

	bgHeight = Math.max(floorHeight + s_bg1[bgIndex1].height, floorHeight + (pitHeight * 2) - (pitHeight / 2));
	ctx.fillStyle = s_bg2[bgIndex2].topColor;
	ctx.fillRect(0, floorHeight + (pitHeight * 1), width, pitHeight/2);
	ctx.fillStyle = s_bg2[bgIndex2].bottomColor;
	ctx.fillRect(0, bgHeight, width, pitHeight/2 );
	s_bg2[bgIndex2].drawBackGround(ctx, 0,bgHeight - (s_bg2[bgIndex2].height/2), width); // + X Für debug

	bgHeight = Math.max(floorHeight + s_bg1[bgIndex1].height + s_bg2[bgIndex2].height, floorHeight + (pitHeight * 3) - (pitHeight / 2) );
	ctx.fillStyle = s_bg3[bgIndex3].topColor;
	ctx.fillRect(0, floorHeight + (pitHeight * 2), width, pitHeight/2);
	ctx.fillStyle = s_bg3[bgIndex3].bottomColor;
	ctx.fillRect(0, bgHeight, width, pitHeight/2 );
	s_bg3[bgIndex3].drawBackGround(ctx, 0, bgHeight - (s_bg3[bgIndex3].height/2), width);

	s_entrance.draw(ctx, (width-s_entrance.width)/2, 33);
	
	ctx.fillStyle = "#000";
	ctx.fillRect(0, s_entrance.height + 33 - 10, width, 10);

	s_joe.draw(ctx,(width-s_joe.width)/2 , floorHeight - s_joe.height );

	
	if (currentstate === states.Game) {
		
	}
	
	if (currentstate === states.Start) {
		s_buttons.start.drawScaled(ctx,(width-(s_buttons.start.width*2))/2 , (height-(s_buttons.start.height*2))/2,s_buttons.start.width * 2, s_buttons.start.height * 2);
	} else {
		
		for(let i = 0; i < minerals.length; i++){
			minerals[i].draw(ctx);
		}
		
		ctx.lineWidth = 2;
		
		ctx.strokeText(" " + Math.round(gameTimer) + " Sec",10,50);
		ctx.fillStyle = "#DDD";
		ctx.fillText(" " + Math.round(gameTimer) + " Sec", 10, 50);
		
		ctx.strokeText(score + " $",width - 70 - (score.toString().length * 30) ,50);
		ctx.fillStyle = "#DDD";
		ctx.fillText(score + " $", width - 70 - (score.toString().length * 30), 50);
		
		ctx.lineWidth = 1;
	}
	
	// Draw hook infront of minerals
	hook.draw(ctx);

	if (currentstate === states.Score) {
		s_buttons.next.drawScaled(ctx,(width-(s_buttons.next.width*2))/2 , (height-(s_buttons.next.height*2))/2,s_buttons.next.width * 2, s_buttons.next.height * 2);

	} else {
		// draw score to top of canvas
		//s_numberB.draw(ctx, null, 20, score, width2);
		//console.log(currentstate);

	}
}

/**
 * Called on mouse or touch press. Update and change state
 * depending on current game state.
 * 
 * @param  {MouseEvent/TouchEvent} evt tho on press event
 */
function onInputPress(evt) {

	switch (currentstate) {

		case states.Start:
			currentstate = states.Init;
			break;

		// update bird speed
		case states.Game:
			hook.fire();
			break;

		// change state if event within startBtn bounding box
		case states.Score:
			currentstate = states.Init;
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

	if(ctx){
		ctx.font = "50px Arial";
	}

	if(s_rope){
		hook.x = (width-s_rope.width) / 2;
	}
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