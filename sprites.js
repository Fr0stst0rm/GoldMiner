let 

// Sprite vars //

s_bg1,
s_bg2,
s_bg3,
s_entrance,
s_support_beam1,
s_support_beam2,
s_support_beam3,
s_joe,
s_joe_face,
s_joe_sweat,
s_winch,
s_cart,
s_rope,
s_hook1,
s_hook2,
s_gold_s,
s_gold_m,
s_gold_l,
s_rock_s,
s_rock_m,
s_rock_l,
s_diamond,
s_buttons;

/**
 * Simple sprite class
 * 
 * @param {Image}  img    spritesheet image
 * @param {number} x      x-position in spritesheet
 * @param {number} y      y-position in spritesheet
 * @param {number} width  width of sprite 
 * @param {number} height height of sprite
 */
let Sprite = function(img, x, y, width, height) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

/**
 * Simple sprite class
 * 
 * @param {Image}  img    spritesheet image
 * @param {number} x      x-position in spritesheet
 * @param {number} y      y-position in spritesheet
 * @param {number} width  width of sprite 
 * @param {number} height height of sprite
 * @param {string} topColor  color to repeat on top
 * @param {string} bottomColor color to repeat on bottom
 */
let BGSprite = function(img, x, y, width, height, topColor, bottomColor) {
	Sprite.apply(this, arguments);
	this.topColor = topColor;
	this.bottomColor = bottomColor;	
};
/**
 * Draw sprite to canvas context
 * 
 * @param  {CanvasRenderingContext2D} ctx context used for drawing
 * @param  {number} x   x-position on canvas to draw from
 * @param  {number} y   y-position on canvas to draw from
 */
Sprite.prototype.draw = function(ctx, x, y) {
	//TODO DEl after Debug
	//ctx.rect(this.x, this.y, this.width, this.height);
	//ctx.stroke();
	//ctx.rect(x, y, this.width, this.height);
	//ctx.stroke();
	//Draw Img
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
};

/**
 * Draw sprite to canvas context
 * 
 * @param  {CanvasRenderingContext2D} ctx context used for drawing
 * @param  {number} x   x-position on canvas to draw from
 * @param  {number} y   y-position on canvas to draw from
 * @param {number} scaleWidthTo scale width to canvas, 0-1 (%)
 * @param {number} scaleHeightTo scale height to canvas, 0-1 (%)
 */
Sprite.prototype.drawScaled = function(ctx, x, y, scaleWidthTo=0, scaleHeightTo=0) {
	let scaledWidth = (scaleWidthTo > 0) ? scaleWidthTo : this.width;
	let scaledHeight = (scaleHeightTo > 0) ? scaleHeightTo : this.height;
	ctx.drawImage(this.img, this.x, this.y, this.width, this.height,
		x, y, scaledWidth, scaledHeight);
};

BGSprite.prototype.drawBackGround = function(ctx, x, y, scaleWidthTo=0, scaleHeightTo=0) {
	//console.log(this);
	//console.log(x+" "+y);
	Sprite.prototype.drawScaled.call(this, ctx, x, y, scaleWidthTo, scaleHeightTo)
};

/**
 * Initate all sprite
 * 
 * @param  {Image} img spritesheet image
 */
function initSprites(img) {

	s_bg1 = [
		new BGSprite(img,   0, 313, 1024, 388-313,"#ceb35f","#a6904d"),
		new BGSprite(img,   0, 390, 1024, 507-390,"#ceb35f","#a6904d"),
		new BGSprite(img,   0, 508, 1024, 608-508,"#ceb35f","#a6904d")
	];

	s_bg2 = [
		new BGSprite(img,   0, 610, 1024, 685-610,"#a6904d","#806e3b"),
		new BGSprite(img,   0, 687, 1024, 804-687,"#a6904d","#806e3b")
	];

	s_bg3 = [
		new BGSprite(img,   0, 805, 1024, 923-805,"#806e3b","#66675d"),
		new BGSprite(img,   0, 924, 1024, 1024-924,"#806e3b","#66675d")
	];

	s_entrance = new Sprite(img,   796, 50, 1024-796, 234-50);
	
	//-------------------- TODO --------------------------
	s_support_beam1 = new Sprite(img,   0, 0, 138, 114);
	s_support_beam2 = new Sprite(img,   0, 0, 138, 114);
	s_support_beam3 = new Sprite(img,   0, 0, 138, 114);
	//----------------------------------------------------

	s_joe = new Sprite(img,   338, 0, 406-338, 107);

	//-------------------- TODO --------------------------
	s_joe_face = [
		new Sprite(img, 156, 115, 17, 12),
		new Sprite(img, 156, 128, 17, 12),
		new Sprite(img, 156, 141, 17, 12)
	];
	s_joe_sweat = [
		new Sprite(img, 156, 115, 17, 12),
		new Sprite(img, 156, 128, 17, 12),
		new Sprite(img, 156, 141, 17, 12)
	];

	s_winch  = [
		new Sprite(img, 156, 115, 17, 12),
		new Sprite(img, 156, 128, 17, 12),
		new Sprite(img, 156, 141, 17, 12)
	];

	s_cart = new Sprite(img, 0, 0, 138, 114);
	//----------------------------------------------------
	s_rope = new Sprite(img, 275, 179, 284 - 275, 236 - 179);
	s_hook1 = new Sprite(img, 293, 38, 331-293, 118 - 38 );
	s_hook2 = new Sprite(img, 293, 119 , 331-293, 189 - 119);

	s_gold_s = new Sprite(img, 203, 97, 277-203, 170-97);
	s_gold_m = new Sprite(img, 198, 0, 293-198, 93);
	s_gold_l = new Sprite(img, 0, 0, 198, 163);

	s_rock_s = new Sprite(img, 566, 0, 620-566, 50);
	s_rock_m = new Sprite(img, 164, 175, 260-164, 250-175);
	s_rock_l = new Sprite(img, 1, 164, 160-1, 256-164);

	s_diamond = new Sprite(img, 295, 0, 338-295, 37);
	
	s_buttons = {
		start:  new Sprite(img,  338, 110, 552-338, 160-110),
		restart:  new Sprite(img, 338, 161, 552-338, 214-161),
		next:  new Sprite(img, 338, 215, 552-338, 267-215)
	}
}