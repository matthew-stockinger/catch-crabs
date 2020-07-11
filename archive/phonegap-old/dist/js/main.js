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

'use strict';

const app = {
    // Application Constructor
    initialize() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady() {
        /* Main code here.  Sets event handlers.  Dispatches event calls to Game and View objects. */
        let swapTimer;
        const dispatch = {
            gameStart(event) {
                event.preventDefault();
                Game.start(); // reset score to 0.
                View.render(View.scoreLabel, 0);
                dispatch.resetCrab(); // put crab in left/top again.  Reset/place event handlers.
                View.hide(View.gameOverScreen);
                View.show(View.gameScreen);
                swapTimer = setInterval(dispatch.crabSwap, 2000);
            },

            scorePoint(event) {
                event.preventDefault();
                Game.scorePoint(); // update score variable
                View.render(View.scoreLabel, Game.getScore());
            },

            crabSwap() {
                console.log("dispatch.crabSwap()");
                View.crabHere.removeEventListener("click", dispatch.scorePoint);
                View.crabNotHere.removeEventListener("click", dispatch.gameOver);
                View.crabSwap();
                View.crabHere.addEventListener("click", dispatch.scorePoint);
                View.crabNotHere.addEventListener("click", dispatch.gameOver);
            },

            resetCrab() {
                console.log("dispatch.resetCrab()");
                View.crabHere.removeEventListener("click", dispatch.scorePoint);
                View.crabNotHere.removeEventListener("click", dispatch.gameOver);
                View.resetCrab();
                View.crabHere.addEventListener("click", dispatch.scorePoint);
                View.crabNotHere.addEventListener("click", dispatch.gameOver);
            },

            gameOver(event) {
                event.preventDefault();
                clearInterval(swapTimer);
                View.hide(View.gameScreen);
                View.show(View.gameOverScreen);
                let endMessage = `<p>Game over.</p>`;
                endMessage += `<p>You scored ${Game.getScore()} points.</p>`;
                View.render(View.gameOverMsg, endMessage);
            }
        };

        View.playAgainBtn.addEventListener("click", dispatch.gameStart);
        View.playAgainBtn.click();
    }
};

app.initialize();
