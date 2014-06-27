/** 
 * Hello there! Welcome to the Canvas Live Editor.
 * This is my personal browser based programming environment
 * for prototyping small canvas graphical experiments.
 * I hope you find it useful.
 * Developed By Anthony Del Ciotto
 */

/**
 * Here is the main canvas drawing context.
 * @type {[type]}
 */
var ctx = Demo.context;

/**
 * Any updating or rendering logic you want continually displayed,
 * place here!
 * @return {[type]} [description]
 */
Demo.animate = function() {
	// clear the screen (if no color passed in, the function uses clearRect
	// rather than fillRect)
	Demo.clearCanvas();

	ctx.fillStyle = '00FFF0';
	ctx.fillRect(Demo.width/2, Demo.height/2, 100 - 50, 100 - 50);
};