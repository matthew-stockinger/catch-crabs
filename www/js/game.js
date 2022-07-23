'use strict';
/* Back-end game functionality.  e.g. score handling. */
let timeUpdate = new Event('timeUpdate');
const Game = {
  score: null,
  maxScore: null,
  cps: null, // clicks per second
  maxCPS: null,
  hits: [], // timeStamp of each hit
  time: null, // game time elapsed, in seconds
  startStamp: null, // system timeStamp of game start (first click)

  start() {
    this.score = 0;
    this.maxScore = 0;
    this.cps = 0;
    this.maxCPS = 0;
    this.time = 0;
    this.hits = [];
    this.startStamp = null;
  },

  // starts game timer.
  startTime(event) {
    this.startStamp = Math.round(event.timeStamp);
    this.timeInterval = setInterval(() => {
      this.time += 1;
      let minutes = Math.floor(this.time / 60);
      if (minutes === 0) minutes = "0";
      let seconds = this.time % 60;
      if (seconds < 10) seconds = "0" + seconds;
      let timeString = `${minutes}:${seconds}`;
      timeUpdate = new CustomEvent('timeUpdate', {
        detail: {
          timeString: timeString
        }
      });
      window.dispatchEvent(timeUpdate);
    }, 1000);
  },

  stopTime(event) {
    clearInterval(this.timeInterval);
    this.time = 0;
  },

  setScore(value) {
    if (typeof value == "number") {
      this.score = Math.round(value);
    } else {
      throw new TypeError("setScore(value) called: value must be a number");
    }
  },

  getScore() {
    return this.score;
  },

  // calculates clicks per second over the past cpsInterval seconds, otherwise returns 0.
  getCPS() {
    let lastHit = this.hits[this.hits.length - 1];
    const cpsInterval = 3;
    if (this.hits.length <= 1 || this.time < cpsInterval) {
      this.cps = 0;
    } else {
      // what's the cps rate over the past cpsInterval seconds?
      let gap = 2; // how many hits earlier should we start looking?
      let firstHit = this.hits[this.hits.length - gap];
      // find the index of the first hit that is >= cpsInterval seconds away.
      while (lastHit - firstHit < cpsInterval * 1000) {
        gap += 1;
        firstHit = this.hits[this.hits.length - gap];
      }
      // if the user quits clicking before cpsInterval, or if there isn't 
      // a first hit that is >= cpsInterval away, firstHit == undefined:
      if (!firstHit) {
        if (this.time * 1000 - lastHit < 1000) {
          this.cps = (this.hits.length / lastHit * 1000);
        } else {
          // ensures that cps decays over time if no user interaction.
          this.cps = (this.hits.length / this.time);
        }
        // finally, this is the typical scenario of continued button mashing
      } else {
        if (this.time * 1000 - lastHit < 1000) {
          this.cps = (gap / (lastHit - firstHit) * 1000);
        } else {
          this.cps = (gap / (this.time - firstHit / 1000));
        }
      }
    }
    return this.cps;
  },

  randBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }
};