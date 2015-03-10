var MatchThree = function(game) {
  this.game = game;

  this.boardWidth = 8;
  this.boardHeight = 7;

  this.moveCount = 0;
  this.moveLimit = 20;

  this.chainCount = 1;

  this.board = [];
  this.selectedTile = null;
  this.idCount = 0;
  this.highScore = 0;
  this.rewind = false;

};

MatchThree.prototype = {
  preload: function() {
    // Draw a white Square
    this.squarebmd = this.game.add.bitmapData(55, 55);
    this.squarebmd.ctx.strokeStyle = '#000';
    this.squarebmd.ctx.rect(0, 0, 55, 55);
    this.squarebmd.ctx.fillStyle = '#fff';
    this.squarebmd.ctx.fill();

    this.game.load.audio('match', 'assets/audio/match3.wav');
    this.game.load.audio('select', 'assets/audio/select.wav');
  },
  create: function() {
    this.matchTiles = this.game.add.group();
    this.matchTiles.createMultiple(64, this.squarebmd);
    this.matchTiles.setAll('anchor.x', 0.5);
    this.matchTiles.setAll('anchor.y', 0.5);

    this.matchSnd = this.game.add.sound('match');
    this.matchSnd.volume = 0.5;
    this.selectSnd = this.game.add.sound('select');
    this.selectSnd.volume = 0.5;

    this.colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ffff, 0x00ff00];

    this.bonusText = this.game.add.bitmapText(Game.w/2, Game.h/2, 'arcade','', 72);
    this.bonusText.align = 'center';

    this.chainText = this.game.add.bitmapText(Game.w/2, Game.h/2, 'arcade','', 64);
    this.chainText.align = 'center';
    this.chainText.tint = 0x99ffff;
  },
  addTile: function() {
    var num = this.game.rnd.between(0, 4);
    var gTile = this.matchTiles.getFirstDead();
    gTile._id = this.idCount;
    gTile.spriteNum = num;
    gTile.tint = this.colors[num];
    gTile.inputEnabled = true;
    gTile.events.onInputDown.add(this.clickTile, this);
    gTile.reset(this.game.world.centerX, -this.game.world.centerY);
    this.idCount++;
    return gTile;
  },
  initialBoard: function() {
    this.board = [];
    for(var i = 0; i < this.boardWidth;i++) {
      var column = [];
      for(var j = 0; j < this.boardHeight;j++) {
        var gTile = this.addTile();
        column.push(gTile);
      }
      this.board.push(column);
    }
    this.removeMatches();
    this.drawBoard();
    return this.board;
  },
  removeMatches: function() {
    for(var i = 0; i < this.boardWidth;i++) {
      for(var j = 0; j < this.boardHeight;j++) {
        var cTile = this.board[i][j];
        while ((this.horizontalMatch(cTile).length > 0) || (this.verticalMatch(cTile).length > 0))  {
          //Randomize color on match
          var num = this.game.rnd.between(0, 4);
          this.board[i][j].spriteNum = num;
          this.board[i][j].tint = this.colors[num];
        }
      }
    }
  },
  drawBoard: function() {
    if (this.swapping) {return;}
    this.swapping = true;

    for(var i = 0; i < this.boardWidth;i++) {
      for(var j = 0;j < this.boardHeight;j++) {
        var xpos = i*64 + 80;  
        var ypos = 500 - j*64;
        var cTile = this.board[i][j];
        if (cTile.x !== xpos || cTile.y !== ypos) {
          var t = this.game.add.tween(cTile).to({x: xpos, y: ypos},300).start();
        }
      }
    }
    t.onComplete.add(function() {
      this.swapping = false;
      var score = this.scoreMatches();
      if (score > 0) {
        //Increment High Score and Check to make sure additions
        //didn't cause more scoring matches
        if (this.chainCount > 1) {
          this.chainText.setText('Chain Bonus x '+this.chainCount);
          this.chainText.updateText();
          this.chainText.x = this.game.world.centerX - (this.chainText.textWidth * 0.5);
          this.chainText.y = this.game.world.centerY - 300;
          this.chainText.alpha = 1;

          var m = this.game.add.tween(this.chainText).to({y: Game.w/2+300, alpha: 0 },2200).start();
           
        }
        this.matchSnd.play();
        this.highScore += score;
        this.chainCount += 1;

        this.drawBoard();
      }else {
        this.chainCount = 1; //Reset Chain counter
        if (this.highScore !== 0) {
          //Add move count after Chains have stopped
          //unless this is the first load
          this.moveCount += 1;
        }
      }
    },this);
  },
  horizontalMatch: function(cTile) {
    var pos = this.getPosition(cTile);
    if(pos.i === 0 || pos.i === (this.boardWidth - 1)) {
      return [];
    }

    var pTile = this.board[pos.i-1][pos.j];
    var nTile = this.board[pos.i+1][pos.j];

    if (cTile.spriteNum === pTile.spriteNum && cTile.spriteNum === nTile.spriteNum) {
      return [pTile._id, cTile._id, nTile._id];
    }
    return [];
  },
  verticalMatch: function(cTile) {
    var pos = this.getPosition(cTile);
    if(pos.j === 0 || pos.j === (this.boardHeight - 1)) {
      return [];
    }

    var pTile = this.board[pos.i][pos.j - 1];
    var nTile = this.board[pos.i][pos.j + 1];

    if (cTile.spriteNum === pTile.spriteNum && cTile.spriteNum === nTile.spriteNum) {
      return [pTile._id, cTile._id, nTile._id];
    }
    return [];
  },
  getMatches: function() {
    var matches = [];
    this.matchTiles.forEach(function(cTile) {
      if (cTile.alive) {
        matches = _.union(matches, this.horizontalMatch(cTile),this.verticalMatch(cTile));
      }
    },this);
    return matches;

  },
  scoreMatches: function() {
    var matches = this.getMatches();
    var score = matches.length;

    //Clear Matches
    for(var i = 0; i < this.boardWidth; i++) {
      for(var j = 0; j < this.boardHeight; j++) {
        var cTile = this.board[i][j];
        if (matches.indexOf(cTile._id) > -1  ) {
          cTile.kill();
          this.board[i].splice(j,1);
          this.board[i].push(this.addTile());
          j--;
        }else {
        }
      }
    }

   // var pairs =  _.countBy(matches, function(n) {
   //    return n;
   //  });
   //  console.log('match pairs'+ JSON.stringify(pairs));

    // if (matches.length > 8) {
    //   score = this.matchBonus('BIG MATCH BONUS',score, 6);
    // }else if (matches.length > 3) {
    //   score = this.matchBonus(score); 
    // }

    if (matches.length > 3) {
      score = this.matchBonus(score);
    }
    
    // else if (matches.length === 8) {
    //   score = this.matchBonus('Match 8 Bonus',score, 4);
    // }
    // else if (matches.length >= 6 && matches.length < 8) {
    //   score = this.matchBonus('Match 6 Bonus',score, 3);
    // }
    // else if (matches.length >= 4 && matches.length < 6) {
    //   score = this.matchBonus('Match 4 Bonus',score, 2);
    // }

    if (this.chainCount > 0) {
      score *= this.chainCount;
    }

    return score;
  },
  matchBonus: function(score) {
      //Double points for match 4

      var modifier = 2 * Math.round(score / 2);

      this.bonusText.setText('Match '+score+' Bonus');
      this.bonusText.updateText();
      this.bonusText.x = this.game.world.centerX - (this.bonusText.textWidth * 0.5);
      this.bonusText.y = this.game.world.centerY - 400;
      this.bonusText.alpha = 1;

      var m = this.game.add.tween(this.bonusText).to({y: Game.w/2+300, alpha: 0 },2000).start();
      
      return score * modifier;
  },
  clickTile:  function(clickedTile) {
    if (this.selectedTile === null) {
      //Tile Clicked
      this.selectSnd.play();
      this.selectedTile = clickedTile; 
    }else if (clickedTile.y === this.selectedTile.y && clickedTile.x === this.selectedTile.x) {
      // Reset Tile if Clicked Again
      this.game.tweens.remove(this.t);
      clickedTile.angle = 0;
      this.selectedTile = null;
    }else if (this.isAdjacent(this.selectedTile, clickedTile)) {
      //Swap Tile positions if they're adjacent
      this.game.tweens.remove(this.t);
      this.selectedTile.angle = 0;

      this.scored = false;
      this.swapPositions(this.selectedTile, clickedTile);

      this.selectedTile = null;
    }else {
      //If Tiles are not  adjacent deselect current tile
      this.game.tweens.remove(this.t);
      this.selectedTile.angle = 0;
      this.selectedTile = null;
    }

    if (this.selectedTile !== null) {
      this.t = this.game.add.tween(this.selectedTile).to({angle: this.selectedTile.angle + 180}, 600, Phaser.Easing.Linear.None).to({angle: this.selectedTile.angle}, 600, Phaser.Easing.Linear.None).start().loop(); 
    }

  },
  swapPositions: function(firstTile, secondTile) {
      var firstPos = this.getPosition(firstTile);
      var secondPos = this.getPosition(secondTile);

      this.board[firstPos.i][firstPos.j] = secondTile;
      this.board[secondPos.i][secondPos.j] = firstTile;

      var matchCount = this.getMatches().length;

      // If it scores
      if (matchCount !== 0) {
        this.drawBoard();
      } else {
        this.board[firstPos.i][firstPos.j] = firstTile;
        this.board[secondPos.i][secondPos.j] = secondTile;
      }

  },
  getPosition: function(tile) {
    //Iterate through game board until the the tile is found
    //return it's position in the 2d array

    for(var i = 0;i < this.boardWidth;i++) {
      var j = this.board[i].indexOf(tile);
      if (j > -1) {
        return {i: i, j: j};
      }
    }
    return {};
  },
  isAdjacent: function(firstTile, secondTile) {
    var firstPos = this.getPosition(firstTile);
    var secondPos = this.getPosition(secondTile);

    if (
        (secondPos.i === firstPos.i) && 
        ((secondPos.j === (firstPos.j - 1)) || (secondPos.j === (firstPos.j + 1)))) {
      return true;
    }else if ((secondPos.j === firstPos.j) && 
        ((secondPos.i === (firstPos.i - 1)) || (secondPos.i === (firstPos.i + 1)))) {
      return true;
    }else {
      return false;
    }

  },
};
