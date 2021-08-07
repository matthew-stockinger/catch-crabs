/* Back-end game functionality.  e.g. score handling. */
const Game = {
    score: null,
    maxScore: null,
    cps: null,
    maxCPS: null,
    hits: [],
    start() {
        this.score = 0;
        this.maxScore = 0;
        this.cps = 0;
        this.maxCPS = 0;
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