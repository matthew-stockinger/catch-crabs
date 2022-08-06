'use strict';

const Sounds = {
  crabClick: new Howl({ src: ['audio/pop.mp3'] }),
  crabMiss: new Howl({ src: ['audio/misspop1.mp3'] }),
  hundo: new Howl({ src: ['audio/hundo1.mp3'] }),

  mute(muted) {
    Howler.mute(muted);
  }
};
