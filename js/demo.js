/* 
* @Author: Anthony Del Ciotto
* @Date:   2014-06-25
* @Last Modified by:   anthony
* @Last Modified time: 2014-07-18
*
* @Description: 
*
* @License: The MIT License (MIT) Copyright (c) [year] [fullname]
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/
'use strict';

// shim layer with setTimeout fallback http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var Demo = (function() {
	var canvas,
		lastTime = 0,
		stats;

	return {
		context: null,
		width: $('.canvas-container').width(),
		height: $('.canvas-container').height(),
		useRAF: true,
		isError: false,

		updateDemo: function() {
			this.context.save();
			try {
				stats.begin();
				if (!this.isError) {
					this.animate.call(this);
				} 
				stats.end();
			} catch(e) {
				$('.error-display').html('Error: ' + e.message);
				$('.error-display').toggleClass('error', true);
				this.isError = true;
			}
			this.context.restore();
			if (this.useRAF) requestAnimFrame(this.updateDemo.bind(this));
		},

		/**
		 * This is overriden in the live editor script.
		 * @return {[type]} [description]
		 */
		animate: function() {},
		initialise: function() {},

		/**
		 * Initialise our canvas and context
		 * @return {[type]} [description]
		 */
		init: function(divId) {
			canvas = document.getElementById(divId);
			this.context = canvas.getContext('2d');
			stats = new Stats();
			stats.setMode(1);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '5px';
			stats.domElement.style.top = '5px';
			$('.canvas-container').append(stats.domElement);
		},

		resumeRAF: function() {
			if (!this.useRAF) {
				this.useRAF = true;
				this.updateDemo();
			}
		},

		pauseRAF: function() {
			if (this.useRAF) {
				this.useRAF = false;
			}
		},

		toggleRAF: function() {
			this.useRAF = !this.useRAF;

			if (this.useRAF) {
				this.updateDemo();
			}
		},

		clearCanvas: function(color) {
			if (typeof color === 'undefined') {
				this.context.clearRect(0, 0, this.width, this.height);
			} else {
				this.context.fillStyle = color;
				this.context.fillRect(0, 0, this.width, this.height);
			}
		},

		/**
		 * Begin our RAF loop
		 * @param  {[type]} divId [description]
		 * @return {[type]}       [description]
		 */
		start: function(divId) {
			this.updateDemo();
		},

		resize: function(w, h) {
			this.width = w;
			this.height = h;
			canvas.width = this.width;
			canvas.height = this.height;
		}
	}
})();
