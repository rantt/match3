/*global Game*/
Game.Menu = function(game){
  this.game = game;
};

Game.Menu.prototype =  {
    create: function() {
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

    leftEmitter.start(false, 4000, 10);
    rightEmitter.start(false, 4000, 10);


        this.title = this.game.add.sprite(Game.w/2,Game.h/2-100,'title');
        this.title.anchor.setTo(0.5,0.5);

        // this.instructions = this.game.add.sprite(Game.w/2+200,200,'instructions');
        // this.instructions.scale.x = 0.5;
        // this.instructions.scale.y = 0.5;

        // Start Message
        // var text = this.game.add.text(Game.w/2, Game.h/2-50, '~click to start~', { font: '30px Helvetica', fill: '#000' });
        // text.anchor.setTo(0.5, 0.5);

    },
    update: function() {
      //Click to Start
      if (this.game.input.activePointer.isDown){
        this.game.state.start('Play');
      }
    }
};
