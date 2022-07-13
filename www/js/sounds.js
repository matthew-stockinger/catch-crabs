const Sounds = {
  pop: '../audio/pop.mp3',

  play(soundFilePath) {
    const audioElt = new Audio(soundFilePath);
    audioElt.play();
  }
};