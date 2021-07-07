/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* to shut some eslint errors.  */
/* global View:writable, Game:writable */

var app = {
	initialize() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},

	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	onDeviceReady() {
		this.runApp();
	},

	runApp() {
		Dispatch.init();
	}
};

let swapTimer;
let lastMouseMoveTimeStamp = 0;
const crabMoveStart = new Event('crabMoveStart'); // see Dispatch.cycleCrab
const crabMoveEnd = new Event('crabMoveEnd');
const Dispatch = {
	init() {
		// note:
		// all event listener callbacks in this code use anonymous arrow functions
		// so that the value of 'this' will always be the parent object, not
		// the click target element.
		View.preventDrag();
		View.playAgainBtn.addEventListener("click", (event) => {
			this.gameStart(event);
		}, false);

		// desktop
		View.svg.addEventListener("mousedown", (event) => {
			console.log(`hitbox mousedown fired.  event target = ${event.target}`);
			this.crabClick(event);
		}, false);
		View.gameScreen.addEventListener("mousedown", (event) => {
			console.log(`gameScreen mousedown fired.  event target = ${event.target}`);
			this.crabMiss(event);
		}, false);
		// mobile
		View.svg.addEventListener("touchstart", (event) => {
			console.log(`hitbox touchstart fired.  event target = ${event.target}`);
			this.crabClick(event);
		}, false);
		View.gameScreen.addEventListener("touchstart", (event) => {
			console.log(`gameScreen touchstart fired.  event target = ${event.target}`);
			this.crabMiss(event);
		}, false);

		View.playAgainBtn.click();
	},

	gameStart(event) {
		event.preventDefault();
		Game.start(); // reset score to 0.
		View.render(View.scoreLabel, 0);
		this.resetCrab(); // put crab in left/top again.
		View.hide(View.gameOverScreen);
		View.show(View.gameScreen);
		View.animateEyes(2, 4);
		View.twitchLClaw(5, 8);
		View.twitchRClaw(10, 20);
		this.cycleCrab(1, 5); // start crab moving back and forth.
	},

	// moves crab between regions at random time intervals.
	cycleCrab(minTime, maxTime) {
		let t = Math.random() * (maxTime - minTime) + minTime;
		t = t.toFixed(3);
		swapTimer = setTimeout(() => {
			this.crabSwap();
			// safari <=12 doesn't fire transitionstart event, so need synthetic.
			View.svgWrap.dispatchEvent(crabMoveStart); // listener is in view.js
			this.cycleCrab(minTime, maxTime);
		}, t * 1000);
	},

	crabClick(event) {
		console.log(`crabClick() called`);
		event.preventDefault();
		event.stopPropagation();
		View.animateClickStar(event, true);
		this.scorePoint(event);
	},

	crabMiss(event) {
		console.log(`crabMiss() called`);
		event.preventDefault();
		View.animateClickStar(event, false);
		// this.gameOver(event);
	},

	scorePoint(event) {
		event.preventDefault();
		Game.scorePoint(); // update score variable
		View.render(View.scoreLabel, Game.getScore());
	},

	crabSwap() {
		View.crabSwap();
	},

	resetCrab() {
		View.resetCrab();
	},

	gameOver(event) {
		event.preventDefault();
		clearTimeout(swapTimer);
		View.hide(View.gameScreen);
		View.show(View.gameOverScreen);
		View.animateResetAll();
		let endMessage = `<p>Game over.</p>`;
		endMessage += `<p>You scored ${Game.getScore()} point` +
			`${Game.getScore() === 1 ? '' : 's'}.</p>`;
		View.render(View.gameOverMsg, endMessage);
	}
};

app.initialize();
