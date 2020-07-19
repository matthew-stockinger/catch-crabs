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
const Dispatch = {
	init() {
		// all event listener callbacks in this code use anonymous arrow functions
		// so that the value of 'this' will always be the parent object, not
		// the click target element.
		View.playAgainBtn.addEventListener("click", (event) => {
			this.gameStart(event);
		}, false);
		View.region1.addEventListener("click", (event) => {
			this.regionClick(event, View.region1);
		}, false);
		View.region2.addEventListener("click", (event) => {
			this.regionClick(event, View.region2);
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
		this.cycleCrab(1, 5);
	},

	/*
	pick a random length of time, between 1 and 5 seconds.
	after that amount of time, crabSwap.
	only at that moment of crabSwap, begin again at the top (recurse).

	If crab-not-here clicked, clear the timer and game over.
	*/
	
	// moves crab between regions at random time intervals.
	cycleCrab(minTime, maxTime) {
		let t = Math.random() * (maxTime - minTime) + minTime;
		t = t.toFixed(3);
		swapTimer = setTimeout(() => {
			this.crabSwap();
			this.cycleCrab(minTime, maxTime);
		}, t * 1000);
	},

	regionClick(event, region) {
		event.preventDefault();
		// console.log(`Dispatch.regionClick: ${region.id} clicked`);
		if (region.classList.contains("crab-here")) {
			this.scorePoint(event);
		} else if (region.classList.contains("crab-not-here")) {
			this.gameOver(event);
		}
	},
	
	scorePoint(event) {
		event.preventDefault();
		Game.scorePoint(); // update score variable
		View.render(View.scoreLabel, Game.getScore());
	},

	crabSwap() {
		// console.log("Dispatch.crabSwap()");
		View.crabSwap();
	},

	resetCrab() {
		// console.log("Dispatch.resetCrab()");
		View.resetCrab();
	},

	gameOver(event) {
		event.preventDefault();
		console.log(`game over.  swapTimer = ${swapTimer}.  clearing timeout.`);
		clearTimeout(swapTimer);
		View.hide(View.gameScreen);
		View.show(View.gameOverScreen);
		let endMessage = `<p>Game over.</p>`;
		endMessage += `<p>You scored ${Game.getScore()} point` + 
		`${Game.getScore() === 1 ? '' : 's'}.</p>`;
		View.render(View.gameOverMsg, endMessage);
	}
};

app.initialize();