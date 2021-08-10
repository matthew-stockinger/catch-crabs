/* Back-end game functionality.  e.g. score handling. */
const Game = {
    score: null,
    maxScore: null,
    cps: null,
    maxCPS: null,
    hits: [],
    time: null,
    start() {
        this.score = 0;
        this.maxScore = 0;
        this.cps = 0;
        this.maxCPS = 0;
        this.time = 0;
    },
    startTime() {
        setInterval(() => {
            this.time += 1;
            let minutes = Math.floor(this.time / 60);
            if (minutes === 0) minutes = "0";
            let seconds = this.time % 60;
            if (seconds < 10) seconds = "0" + seconds;
            let timeString = `${minutes}:${seconds}`;
            View.render(View.timeLabel, timeString);
        }, 1000);
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
    randBetween(a, b) {
        return Math.floor(Math.random() * (b - a + 1) + a);
    }
};