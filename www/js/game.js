/* Back-end game functionality.  e.g. score handling. */
const timeUpdate = new Event('timeUpdate');
const Game = {
  score: null,
  maxScore: null,
  cps: null,
  maxCPS: null,
  hits: [],
  time: null,
  startStamp: null,

  start() {
    this.score = 0;
    this.maxScore = 0;
    this.cps = 0;
    this.maxCPS = 0;
    this.time = 0;
    this.hits = [];
    this.startStamp = null;
  },

  startTime(event) {
    this.startStamp = Math.round(event.timeStamp);
    this.timeInterval = setInterval(() => {
      this.time += 1;
      window.dispatchEvent(timeUpdate);
      let minutes = Math.floor(this.time / 60);
      if (minutes === 0) minutes = "0";
      let seconds = this.time % 60;
      if (seconds < 10) seconds = "0" + seconds;
      let timeString = `${minutes}:${seconds}`;
      View.render(View.timeLabel, timeString);
    }, 1000);
  },

  stopTime(event) {
    clearInterval(this.timeInterval);
    View.render(View.timeLabel, "0:00");
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

  // else if (this.time < 5) {
  //   // make the cps fall over time if user stops clicking.
  //   if (this.time * 1000 - lastHit < 1000) {
  //     this.cps = (this.hits.length / lastHit * 1000).toFixed(3);
  //   } else {
  //     this.cps = (this.hits.length / this.time).toFixed(3);
  //   }

  getCPS() {
    let lastHit = this.hits[this.hits.length - 1];
    if (this.hits.length <= 1 || this.time < 5) {
      this.cps = 0;
    } else {
      // what's the cps rate over the past 5 seconds?
      let gap = 2;
      let firstHit = this.hits[this.hits.length - gap];
      // find the index of the first hit that is >= 5000 ms away.
      while (lastHit - firstHit < 5000) {
        gap += 1;
        firstHit = this.hits[this.hits.length - gap];
      }
      // if the user quits clicking before 5s, or if there isn't a first hit 
      // that is >= 5000 ms away:
      if (!firstHit) {
        if (this.time * 1000 - lastHit < 1000) {
          this.cps = (this.hits.length / lastHit * 1000).toFixed(3);
        } else {
          // ensures that cps decays over time if no user interaction.
          this.cps = (this.hits.length / this.time).toFixed(3);
        }
        // finally, this is the typical scenario of continued button mashing:
      } else {
        if (this.time * 1000 - lastHit < 1000) {
          this.cps = (gap / (lastHit - firstHit) * 1000).toFixed(3);
        } else {
          this.cps = (gap / (this.time - firstHit / 1000)).toFixed(3);
        }
      }
    }
    return this.cps;
  },

  randBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }
};