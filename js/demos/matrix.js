/**
 * Here is the main canvas drawing context and
 * any other global vars
 */
var ctx;
var charArray;

/**
 * Place any initialisation logic here!
 */
Demo.initialise = function() {
    ctx = Demo.context;
    charArray = [];
    ctx.font = '10px sans-serif'; 
};

/**
 * Any updating or rendering logic you want continually displayed,
 * place here!
 */
Demo.animate = function() {
	// clear the screen
	Demo.clearCanvas('rgba(0, 0, 0, 0.04)');

    var positions = (Demo.width / 11) | 0; // round this result
    
    if (charArray.length < 100) {
        charArray.push({ x: ((Math.random() * positions) * 11) | 0,  y: 0 });
    }
    
    for (var i = 0; i < charArray.length; i++) {
        charArray[i].c = String.fromCharCode((Math.random()*95 + 12448) | 0);
        if (charArray[i].y > Demo.height) {
          charArray.splice(i, 1);
        }
        else charArray[i].y += 10; 
        if (charArray[i].y > Demo.width) 
            charArray[i].x = 0; 
        ctx.fillStyle = "#00FFF0";
        ctx.fillText(charArray[i].c, charArray[i].x, charArray[i].y);
    }
};