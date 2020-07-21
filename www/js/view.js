
const View = {
    // main game screen elements.
    gameScreen: document.querySelector("#game-screen"),
    region1: document.querySelector("#region1"),
    region2: document.querySelector("#region2"),
    crabHere: document.querySelector(".crab-here"), // The div with the crab
    crabNotHere: document.querySelector(".crab-not-here"), // The div without the crab
    scoreLabel: document.querySelector("#score-label"),
    // game over screen elements.
    gameOverScreen: document.querySelector("#game-over-screen"),
    gameOverMsg: document.querySelector("#game-over-msg"),
    playAgainBtn: document.querySelector("#play-again-btn"),

    render(target, content, attributes) {
        for (const key in attributes) {
            target.setAttribute(key, attributes[key]);
        }
        target.innerHTML = content;
    },

    preventDrag() {
        document.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
    },

    // no using classList.replace on Safari, per MDN on 7.20.2020
    // using remove and add instead.
    hide(elt) {
        elt.classList.remove("visible");
        elt.classList.add("hidden");
    },

    show(elt) {
        elt.classList.remove("hidden");
        elt.classList.add("visible");
    },

    crabSwap() {
        this.crabHere.classList.remove("crab-here");
        this.crabHere.classList.add("crab-not-here");
        this.crabNotHere.classList.remove("crab-not-here");
        this.crabNotHere.classList.add("crab-here");
        // swap the code references.
        [this.crabHere, this.crabNotHere] = [this.crabNotHere, this.crabHere];
        // get rid of stars on blank side
        this.animateResetStars();
    },

    resetCrab() {
        this.region1.classList.remove("crab-not-here");
        this.region1.classList.add("crab-here");
        this.region2.classList.remove("crab-here");
        this.region2.classList.add("crab-not-here");
        this.crabHere = document.querySelector(".crab-here");
        this.crabNotHere = document.querySelector(".crab-not-here");
    },

    // parameter = string name of animation class to add.
    animate(animation) {
        const crab = this.crabHere.querySelector("svg");
        // in case the current animation is already in process, remove that.
        crab.classList.remove(animation);
        // restarts animation.
        // explanation here: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                crab.classList.add(animation);
            });
        });
    },

    animateResetAll() {
        // stop crab animations
        this.crabHere.querySelector("svg").removeAttribute("class");
        // delete stars
        this.animateResetStars();
    },

    animateClickStar(event, region) {
        const image = document.createElement("img");
        image.setAttribute("src", `img/star${Game.randBetween(1,5)}-dist.svg`);
        image.setAttribute("alt", "star");
        // 15 px is half the width and height of the svg, as specified in 
        // the svg file.  Need to change both at once.
        image.style.left = `${event.clientX - 15}px`;
        image.style.top = `${event.clientY - 15}px`;
        // add animation CSS
        image.classList.add("star");

        // image removes itself from DOM once animation completes.
        image.addEventListener("animationend", () => {
            region.removeChild(image);
        });

        // insert at top of #game-screen div.
        region.insertBefore(image, region.querySelector("svg"));
    },

    animateResetStars() {
        this.region1.querySelectorAll("img").forEach((im) => {
            im.remove();
        });
        this.region2.querySelectorAll("img").forEach((im) => {
            im.remove();
        });
    }
};
