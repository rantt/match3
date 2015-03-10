/*global Game*/

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */

// // Choose Random integer in a range
// function rand (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// var musicOn = true;


// var wKey;
// var aKey;
// var sKey;
// var dKey;

Game.Play = function(game) {
  this.game = game;
};

Game.Play.prototype = {
  preload: function() {
    this.matchThree = new MatchThree(this.game);
    this.matchThree.preload();
  },
  create: function() {
    this.game.world.setBounds(0, 0 ,Game.w ,Game.h);

    // // Music
    // this.music = this.game.add.sound('music');
    // this.music.volume = 0.5;
    // this.music.play('',0,1,true);

    //Setup WASD and extra keys
    // wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    // aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    // sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    // dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // muteKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    //

    this.highestScore = JSON.parse(localStorage.getItem('highestScore'));

    this.matchThree.create();
    this.matchThree.initialBoard();

    this.moveText = this.game.add.bitmapText(Game.w - 120 , 16, 'minecraftia','0/'+this.matchThree.moveLimit, 32);

    this.scoreText = this.game.add.bitmapText(20 , 16, 'minecraftia','Score: '+this.matchThree.highScore, 32);
  },

  update: function() {
    this.scoreText.setText('Score: ' + this.matchThree.highScore);
    this.moveText.setText(this.matchThree.moveCount+'/'+this.matchThree.moveLimit);

    // if ((this.matchThree.moveCount === (this.matchThree.moveLimit+1)) && this.matchThree.scoring === false) {
    if (this.matchThree.moveCount === this.matchThree.moveLimit) {
      Game.score = this.matchThree.highScore;
      if (this.matchThree.highScore > this.highestScore) {
        localStorage.setItem('highestScore', this.matchThree.highScore);
      }
      this.game.state.start('Outro');
    }

    
    // // Toggle Music
    // muteKey.onDown.add(this.toggleMute, this);
  },
  
  // toggleMute: function() {
  //   if (musicOn == true) {
  //     musicOn = false;
  //     this.music.volume = 0;
  //   }else {
  //     musicOn = true;
  //     this.music.volume = 0.5;
  //   }
  // },
  // render: function() {
  //   game.debug.text('this.matchThree.scoring' + this.matchThree.scoring, 32, 96);
  // }

};
