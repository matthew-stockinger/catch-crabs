let lEyeTimer, rEyeTimer, lClawTimer, rClawTimer;
const View = {
    // main game screen elements.
    gameScreen: document.querySelector("#game-screen"),
    svgWrap: document.querySelector("#svg-wrap"), // the container div
    hitbox: document.querySelector("#g-wrap"), // g elt. inside svg elt.
    svg: document.querySelector("#svg-crab"), // main svg elt.
    scoreLabel: document.querySelector("#score-label"),
    // game over screen elements.
    gameOverScreen: document.querySelector("#game-over-screen"),
    gameOverMsg: document.querySelector("#game-over-msg"),
    playAgainBtn: document.querySelector("#play-again-btn"),
    lEyePhong: document.querySelector("#lEyePhong"),
    rEyePhong: document.querySelector("#rEyePhong"),
    lClaw: document.querySelector(".lClaw"),
    rClaw: document.querySelector(".rClaw"),

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
        // make crab move to other side of screen
        this.svgWrap.classList.toggle("region1");
        this.svgWrap.classList.toggle("region2");
    },

    resetCrab() {
        /* new code */
        this.svgWrap.classList.remove("region2");
        this.svgWrap.classList.add("region1");
    },

    animateEyes(minTime, maxTime) {
        this.animateLeft(minTime, maxTime);
        this.animateRight(minTime, maxTime);
    },

    animateLeft(minTime, maxTime) {
        let t1 = Math.random() * (maxTime - minTime) + minTime;
        t1 = t1.toFixed(3);
        lEyeTimer = setTimeout(() => {
            this.moveEye("left");
            this.animateLeft(minTime, maxTime);
        }, t1 * 1000);
    },

    animateRight(minTime, maxTime) {
        let t2 = Math.random() * (maxTime - minTime) + minTime;
        t2 = t2.toFixed(3);
        rEyeTimer = setTimeout(() => {
            this.moveEye("right");
            this.animateRight(minTime, maxTime);
        }, t2 * 1000);
    },

    moveEye(which) {
        // which is either 'left' or 'right'
        // randomly moves the eye phong to a new location, using CSS translate.
        // gives effect of the crab looking around.
        if (which === 'left') {
            let eyeX = Math.floor(Math.random() * 2) - 1; // -1 or 0
            let eyeY = Math.floor(Math.random() * 3); // 0, 1, or 2
            this.lEyePhong.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        } else if (which === 'right') {
            let eyeX = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            let eyeY = Math.floor(Math.random() * 3); // 0, 1, or 2
            this.rEyePhong.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        } else {
            throw new Error(`moveEye requires 'left' or 'right' as argument.`);
        }
    },

    twitchLClaw(minTime, maxTime) {
        // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips
        this.lClaw.classList.remove("lClaw-twitch");
        window.requestAnimationFrame((time) => {
            window.requestAnimationFrame((time) => {
                this.lClaw.classList.add("lClaw-twitch");
            });
        });
        
        let t = Math.random() * (maxTime - minTime) + minTime;
        t = t.toFixed(3);
        lClawTimer = setTimeout(() => {
            this.twitchLClaw(minTime, maxTime);
        }, t * 1000);
    },

    twitchRClaw(minTime, maxTime) {
        // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips
        this.rClaw.classList.remove("rClaw-twitch");
        window.requestAnimationFrame((time) => {
            window.requestAnimationFrame((time) => {
                this.rClaw.classList.add("rClaw-twitch");
            });
        });

        let t = Math.random() * (maxTime - minTime) + minTime;
        t = t.toFixed(3);
        rClawTimer = setTimeout(() => {
            this.twitchRClaw(minTime, maxTime);
        }, t * 1000);
    },

    // parameter = string name of animation class to add.
    animate(animation) {
        // in case the current animation is already in process, remove that.
        this.svg.classList.remove(animation);
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
        this.svg.removeAttribute("class");
        // delete stars
        this.animateResetStars();
    },

    // hitCrab is boolean
    animateClickStar(event, hitCrab) {
        const image = document.createElement("img");
        let clientX = 15, clientY = 15;
        // star1-dist.svg is yellow.  star2 is red.
        image.setAttribute("src", `img/star${hitCrab ? 1 : 2}-dist.svg`);
        image.setAttribute("alt", "star");
        // get coords of touchstart/mousedown
        if (event.type === 'mousedown') {
            clientX = Math.round(event.clientX);
            clientY = Math.round(event.clientY);
        } else if (event.type === 'touchstart') {
            clientX = Math.round(event.touches[0].clientX);
            clientY = Math.round(event.touches[0].clientY);
        }
        // 15 px is half the width and height of the svg, as specified in 
        // the svg file.  Need to change both at once.
        image.style.left = `${clientX - 15}px`;
        image.style.top = `${clientY - 15}px`;
        // add animation CSS
        image.classList.add("star");

        // image removes itself from DOM once animation completes.
        image.addEventListener("animationend", () => {
            this.gameScreen.removeChild(image);
        });

        this.gameScreen.insertBefore(image, this.scoreLabel);
    },

    animateResetStars() {
        this.gameScreen.querySelectorAll("img").forEach((im) => {
            im.remove();
        });
    }
};

const rLeg1 = document.querySelector(".rLeg1");
const rLeg2 = document.querySelector(".rLeg2");
const rLeg3 = document.querySelector(".rLeg3");
const rLeg4 = document.querySelector(".rLeg4");
const lLeg1 = document.querySelector(".lLeg1");
const lLeg2 = document.querySelector(".lLeg2");
const lLeg3 = document.querySelector(".lLeg3");
const lLeg4 = document.querySelector(".lLeg4");

// Whenever crab moves, it should trigger walking animations.
View.svgWrap.addEventListener("crabMoveStart", () => {
    rLeg1.classList.remove("rLeg1-move");
    rLeg2.classList.remove("rLeg2-move");
    rLeg3.classList.remove("rLeg3-move");
    rLeg4.classList.remove("rLeg4-move");
    lLeg1.classList.remove("lLeg1-move");
    lLeg2.classList.remove("lLeg2-move");
    lLeg3.classList.remove("lLeg3-move");
    lLeg4.classList.remove("lLeg4-move");
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            rLeg1.classList.add("rLeg1-move");
            rLeg2.classList.add("rLeg2-move");
            rLeg3.classList.add("rLeg3-move");
            rLeg4.classList.add("rLeg4-move");
            lLeg1.classList.add("lLeg1-move");
            lLeg2.classList.add("lLeg2-move");
            lLeg3.classList.add("lLeg3-move");
            lLeg4.classList.add("lLeg4-move");
        });
    });
});
