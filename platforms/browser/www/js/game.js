/* Back-end game functionality.  e.g. score handling. */
const Game = {
    score: null,
    start() {
        this.score = 0;
    },
    scorePoint() {
        this.score++;
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