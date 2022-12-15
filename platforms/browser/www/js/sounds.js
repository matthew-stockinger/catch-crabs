"use strict";

const Sounds = {
  // parceljs won't catch these sound files unless they are fetched using a JS URL constructor.
  crabClick: new Howl({ src: ["audio/pop.mp3"] }),
  crabMiss: new Howl({ src: ["audio/misspop1.mp3"] }),
  hundo: new Howl({ src: ["audio/hundo1.mp3"] }),

  mute(muted) {
    Howler.mute(muted);
  },
};
