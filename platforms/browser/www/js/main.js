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
const crabMoveStart = new Event('crabMoveStart'); // see Dispatch.cycleCrab
const crabMoveEnd = new Event('crabMoveEnd');
const Dispatch = {
	init() {
		this.gameRunning = false;
		View.preventDrag(); //prevents selecting or dragging objects on game screen.

		// note:
		// all event listener callbacks in this code use anonymous arrow functions
		// so that the value of 'this' will always be the parent object, not
		// the click target element.
		View.playAgainBtn.addEventListener("click", (event) => {
			this.gameStart(event);
		}, false);
		window.addEventListener("timeUpdate", (event) => {
			// timeUpdate event fires every 1 second during gameplay.
			this.updateCPS();
			View.render(View.timeLabel, event.detail.timeString);
		}, false);

		// desktop
		View.hitbox.addEventListener("mousedown", (event) => {
			if (!this.gameRunning) {
				this.gameRunning = true;
				this.gameStart(event);
			}
			this.crabClick(event);
		}, false);
		View.gameScreen.addEventListener("mousedown", (event) => {
			this.crabMiss(event);
		}, false);
		View.resetButton.addEventListener("mousedown", (event) => {
			event.stopPropagation();
			this.gameReset(event);
		}, false);

		// mobile
		View.hitbox.addEventListener("touchstart", (event) => {
			if (!this.gameRunning) {
				this.gameRunning = true;
				this.gameStart(event);
			}
			this.crabClick(event);
		}, false);
		View.gameScreen.addEventListener("touchstart", (event) => {
			this.crabMiss(event);
		}, false);
		View.resetButton.addEventListener("touchstart", (event) => {
			event.stopPropagation();
			this.gameReset(event);
		}, false);
	},

	gameStart(event) {
		event.preventDefault();
		Game.start(); // reset backend data.
		View.render(View.scoreLabel, 0);
		this.resetCrab(); 
		View.hide(View.gameOverScreen);
		View.show(View.gameScreen);
		View.animateEyes(2, 4);
		View.twitchLClaw(5, 8);
		View.twitchRClaw(10, 20);
		this.cycleCrab(1, 5); // start crab moving back and forth.
		Game.startTime(event);
	},

	gameReset(event) {
		Game.start(); // reset backend data.
		View.render(View.scoreLabel, 0);
		View.render(View.maxScoreLabel, 0);
		View.render(View.cpsLabel, 0);
		View.render(View.maxCPSLabel, 0);
		this.resetCrab(); 
		this.gameRunning = false;
		Game.stopTime(event);
		this.resetClock();
	},

	// moves crab between regions at random time intervals.
	cycleCrab(minTime, maxTime) {
		if (this.gameRunning) {
			let t = Math.random() * (maxTime - minTime) + minTime;
			t = Number(t.toFixed(3));
			swapTimer = setTimeout(() => {
				this.crabSwap();
				// safari <=12 doesn't fire transitionstart event, so need synthetic.
				View.svgWrap.dispatchEvent(crabMoveStart); // listener is in view.js
				this.cycleCrab(minTime, maxTime);
			}, t * 1000);
		}
	},

	crabClick(event) {
		event.preventDefault();
		event.stopPropagation(); // avoid click firing on background.
		View.animateClickStar(event, true);
		Game.hits.push(Math.round(event.timeStamp) - Game.startStamp);
		this.scorePoint(event);
		this.updateMaxScore(event);
	},

	crabMiss(event) {
		event.preventDefault();
		View.animateClickStar(event, false);
		this.resetScore(event);
		// this.gameOver(event);
	},

	scorePoint(event) {
		Game.score += 1;
		View.render(View.scoreLabel, Game.getScore());
	},

	updateMaxScore(event) {
		if (Game.score > Game.maxScore) {
			Game.maxScore = Game.score;
			View.render(View.maxScoreLabel, Game.maxScore);
		}
		if (Game.score % 100 === 0) {
			View.animateScoreMilestone(Game.score);
		}
	},

	updateCPS() {
		let cps = Game.getCPS();
		View.render(View.cpsLabel, cps.toFixed(2));
		this.updateMaxCPS(cps);
	},

	updateMaxCPS(cps) {
		if (cps > Game.maxCPS) {
			Game.maxCPS = cps;
			View.render(View.maxCPSLabel, cps.toFixed(2));
			View.animateCPSMilestone(cps);
		}
	},

	resetScore(event) {
		Game.setScore(0);
		View.render(View.scoreLabel, 0);
	},

	resetClock() {
		View.render(View.timeLabel, "0:00");
	},

	crabSwap() {
		View.crabSwap();
	},

	resetCrab() {
		clearTimeout(swapTimer); // stop crab walking.
		View.resetCrab(); // put crab back to start region.
		View.animateResetAll(); // stop eye and claw animations.
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
