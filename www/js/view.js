const View = {
    // main game screen elements.
    gameScreen: document.querySelector("#game-screen"),
    svgWrap: document.querySelector("#svg-wrap"),
    hitbox: document.querySelector("#hitbox"),
    svg: document.querySelector("#svg-crab"),
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
        // make crab move to other side of screen
        this.svgWrap.classList.toggle("region1");
        this.svgWrap.classList.toggle("region2");
    },

    resetCrab() {
        /* new code */
        this.svgWrap.classList.remove("region2");
        this.svgWrap.classList.add("region1");
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
        console.log(`in animateClickStar(event, hitCrab).  
        event = ${event} and hitCrab = ${hitCrab}
        event.type = ${event.type}`);
        const image = document.createElement("img");
        let clientX = 15, clientY = 15;
        // star1-dist.svg is yellow.  star2 is red.
        image.setAttribute("src", `img/star${hitCrab ? 1 : 2}-dist.svg`);
        image.setAttribute("alt", "star");
        // get coords of touchstart/mousedown
        if (event.type === 'mousedown') {
            console.log(`event.type === mousedown`);
            clientX = Math.round(event.clientX);
            clientY = Math.round(event.clientY);
        } else if (event.type ==='touchstart') {
            console.log(`event.type === touchstart`);
            clientX = Math.round(event.touches[0].clientX);
            clientY = Math.round(event.touches[0].clientY);
        }
        // 15 px is half the width and height of the svg, as specified in 
        // the svg file.  Need to change both at once.
        console.log(`clientX = ${clientX}`);
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
