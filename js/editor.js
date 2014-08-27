/* 
* @Author: Anthony Del Ciotto
* @Date:   2014-06-22
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

var Editor = (function() {
	var editor = ace.edit('editor'),
		session = editor.getSession(),
		leftPanelDiv = $('.left-panel'),
		rightPanelDiv = $('.right-panel'),
		resizerDiv = $('.resizer'),
		errorStatusDiv = $('.error-display'),
		canvasContainer = rightPanelDiv.find('.canvas-container'),
		paused = false,
		autoRun = true;

	/**
	 * Resizes the editor panel div and the the ace editor.
	 * @param  {[type]} panelWidth [description]
	 * @return {[type]}            [description]
	 */
	var resizeEditorPanel = function() {
		leftPanelDiv.css({
			width: $(window).innerWidth() - rightPanelDiv.width()
		});
		editor.resize();
		Demo.resize(rightPanelDiv.width(), rightPanelDiv.height());
	}

	/**
	 * Function that is called when window resize event triggered.
	 * @return {[type]} [description]
	 */
	var windowResized = function() {
		// round the width to address bug in chrome
		rightPanelDiv.css({ width: Math.floor($(window).innerWidth() / 2) });
		resizeEditorPanel();
	}

	/**
	 * [onMouseDown description]
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	var onMouseDown = function(e) {
		var startWidth = rightPanelDiv.width(),
		pX = e.pageX;

		$(document).on('mouseup', function(me) {
			// resume when resizer released
			if (!paused) Demo.resumeRAF();
			$(document).off('mouseup').off('mousemove');
		});

		$(document).on('mousemove', function(me) {
			// temporarily pause while resizing
			if (!paused) Demo.pauseRAF();

			// calculate the new distance from clicked position to dragged position
			var mx = (me.pageX - pX),
				newWidth = startWidth - mx;

			// clamp the min and max width of the right panel
			if (newWidth > $(window).innerWidth() - resizerDiv.width()*2.5 || newWidth < 15) {
				return;
			}

			// resize both panels
			rightPanelDiv.css({
				left: mx / 2,
				width: newWidth
			});
			resizeEditorPanel(rightPanelDiv.width());
		});
	}

	var onPauseClick = function(e) {
		// change button state to clicked
		$(this).toggleClass('pressed');
		var text = (paused) ? 'Pause' : 'Resume';
		$(this).text(text);

		// toggle use of RAF
		paused = !paused;
		Demo.toggleRAF();
	}

	var onAutoRunClick = function(e) {
		// toggle use of RAF
		autoRun = !autoRun;

		// if we are turning back on, execute script
		if (autoRun) compileScript();

		// change button state to clicked
		$(this).toggleClass('pressed');
	}

	/**
	 * Compile the current ace document and log any errors
	 * to the user.
	 * @return {[type]} [description]
	 */
	var compileScript = function(e) {
		// if we are not auto running, dont execute the demo script
		if (!autoRun) return;

		try {
			eval(session.getDocument().getValue());
			errorStatusDiv.html('Successfully Compiled');
			errorStatusDiv.toggleClass('error', false);

			if (Demo.isError) {
				Demo.isError = false;
			}

			if (!Demo.useRAF) {
				Demo.initialise();
				Demo.updateDemo();
			}
		} catch(e) {
			// update the html and css
			errorStatusDiv.html('Error: ' + e.message);
			errorStatusDiv.toggleClass('error', true);
			Demo.isError = true;
		}
	}

	var scriptLoaded = function(data) {
		session.getDocument().setValue(data);
		compileScript();
		Demo.start();
		windowResized();
	}

	var loadScript = function(scriptName) {
		$.getScript('js/demos/' + scriptName, scriptLoaded);
	}

	/**
	 * Initialise the editor layout so that both
	 * panels each take up 50% of the window width.
	 * @return {[type]} [description]
	 */
	var initEditorLayout = function() {
		// initialise our canvas and context
		Demo.init('live-canvas');
		windowResized();

		// register our events
		$(window).resize(windowResized);
		$('#pause').click(onPauseClick);
		$('#auto-run').click(onAutoRunClick);
		resizerDiv.on('mousedown', onMouseDown);
	}

	return {
		/**
		 * [configure description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		configure: function(options) {
			// set all ace config options
			editor.setTheme('ace/theme/' + options.theme);
			session.setMode('ace/mode/' + options.mode);	
			session.setUseWrapMode(options.useWrapMode);
			session.setTabSize(options.tabSize);
			document.getElementById('editor').style.fontSize = options.fontSize + 'px';
			editor.setShowPrintMargin(options.showPrintMargin);

			// load and set the default script
			session.on('change', compileScript);
			loadScript('matrix.js');
			initEditorLayout();
		}
	}
})();

$(document).ready(function() {
	Editor.configure({ theme: 'monokai', mode: 'javascript', useWrapMode: true, 
		tabSize: 4, fontSize: 14, showPrintMargin: false, defaultScriptPath: 'js/default.js' });
});