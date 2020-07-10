/*
To do:
-check changelog for next steps.

*/

let swapTimer;
const Dispatch = {
	init() {
		this.gameStart_ = this.gameStart.bind(this);
		this.scorePoint_ = this.scorePoint.bind(this);
		this.crabSwap_ = this.crabSwap.bind(this);
		this.resetCrab_ = this.resetCrab.bind(this);
		this.gameOver_ = this.gameOver.bind(this);
		View.playAgainBtn.addEventListener("click", this.gameStart_);
	  	View.playAgainBtn.click();
	},

	gameStart(event) {
		event.preventDefault();
		Game.start(); // reset score to 0.
		View.render(View.scoreLabel, 0);
		this.resetCrab(); // put crab in left/top again.  Reset/place event handlers.
		View.hide(View.gameOverScreen);
		View.show(View.gameScreen);
		swapTimer = setInterval(this.crabSwap_, 2000);
	},

	scorePoint(event) {
		event.preventDefault();
		Game.scorePoint(); // update score variable
		View.render(View.scoreLabel, Game.getScore());
	},

	crabSwap() {
		console.log("Dispatch.crabSwap()");
		View.crabHere.removeEventListener("click", this.scorePoint_);
		View.crabNotHere.removeEventListener("click", this.gameOver_);
		View.crabSwap();
		View.crabHere.addEventListener("click", this.scorePoint_);
		View.crabNotHere.addEventListener("click", this.gameOver_);
	},

	resetCrab() {
		console.log("Dispatch.resetCrab()");
		View.crabHere.removeEventListener("click", this.scorePoint_);
		View.crabNotHere.removeEventListener("click", this.gameOver_);
		View.resetCrab();
		View.crabHere.addEventListener("click", this.scorePoint_);
		View.crabNotHere.addEventListener("click", this.gameOver_);
	},

	gameOver(event) {
		event.preventDefault();
		clearInterval(swapTimer);
		View.hide(View.gameScreen);
		View.show(View.gameOverScreen);
		let endMessage = `<p>Game over.</p>`;
		endMessage += `<p>You scored ${Game.getScore()} point` + 
		`${Game.getScore() === 1 ? '' : 's'}.</p>`;
		View.render(View.gameOverMsg, endMessage);
	}
};

Dispatch.init();
