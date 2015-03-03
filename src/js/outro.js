Game.Outro = function(game) {
  this.game = game;
};

Game.Outro.prototype = {
  create: function() {

		// this.game.stage.backgroundColor = '#FFF';
    this.highestScore = JSON.parse(localStorage.getItem('highestScore'));

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.squarebmd = this.game.add.bitmapData(20, 20);
    this.squarebmd.ctx.strokeStyle = '#000';
    this.squarebmd.ctx.rect(0, 0, 20, 20);
    this.squarebmd.ctx.fillStyle = '#fff';
    this.squarebmd.ctx.fill();

    this.colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ffff, 0x00ff00];

    leftEmitter = this.game.add.emitter(20, this.game.world.centerY - 200);
    leftEmitter.bounce.setTo(0.5, 0.5);
    leftEmitter.setXSpeed(100, 200);
    leftEmitter.setYSpeed(-50, 50);
    leftEmitter.makeParticles(this.squarebmd, 0, 250, 1, true);
    leftEmitter.forEach(function(particle) {
      this.colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ffff, 0x00ff00];
      particle.tint = this.colors[this.game.rnd.between(0, 4)];
    });

    rightEmitter = this.game.add.emitter(this.game.world.width - 20, this.game.world.centerY - 200);
    rightEmitter.bounce.setTo(0.5, 0.5);
    rightEmitter.setXSpeed(-100, -200);
    rightEmitter.setYSpeed(-50, 50);
    rightEmitter.makeParticles(this.squarebmd, 1, 250, 1, true);
    rightEmitter.forEach(function(particle) {
      this.colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ffff, 0x00ff00];
      particle.tint = this.colors[this.game.rnd.between(0, 4)];
    });

    leftEmitter.start(false, 4000, 15);
    rightEmitter.start(false, 4000, 15);


    this.movesText = this.game.add.bitmapText(this.game.world.centerX , this.game.world.centerY-200, 'minecraftia','In Twenty Moves...', 32);
    this.movesText.align = 'center';
    this.movesText.updateText();
    this.movesText.x = this.game.world.centerX - (this.movesText.textWidth * 0.5);


    this.scoreText = this.game.add.bitmapText(this.game.world.centerX , this.game.world.centerY-100, 'minecraftia','Your Score: '+Game.score, 32);
    this.scoreText.align = 'center';
    this.scoreText.updateText();
    this.scoreText.x = this.game.world.centerX - (this.scoreText.textWidth * 0.5);

    this.highText = this.game.add.bitmapText(this.game.world.centerX , this.game.world.centerY, 'minecraftia','Your Highest Score: '+this.highestScore, 32);
    this.highText.align = 'center';
    this.highText.updateText();
    this.highText.x = this.game.world.centerX - (this.highText.textWidth * 0.5);


    this.twitterButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 100,'twitter', this.twitter, this);
    this.twitterButton.anchor.set(0.5);
    this.twitterButton.fixedToCamera = true;

    this.clickHereButton = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200,'clickHere', function() {
        this.game.state.start('Play');  
    }, this);
    this.clickHereButton.anchor.set(0.5);
    this.clickHereButton.fixedToCamera = true;


  },
  twitter: function() {
    window.open('http://twitter.com/share?text=My+best+score+is+'+this.highestScore+'+playing+Match3.+See+if+you+can+beat+it.+at&via=rantt_&url=http://www.divideby5.com/games/match3/&hashtags=match3,1GAM', '_blank');
  },

};
