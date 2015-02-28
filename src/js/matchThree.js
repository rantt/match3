var MatchThree = function(game, width, height) {
  this.game = game;
  this.boardWidth = width;
  this.boardHeight = height;
  this.board = [];
  this.selectedTile = null;
  this.idCount = 0;
  this.highScore = 0;
  this.rewind = false;
};

MatchThree.prototype = {
  preload: function() {
    // Draw a white Square
    this.squarebmd = this.game.add.bitmapData(32, 32);
    this.squarebmd.ctx.strokeStyle = '#000';
    this.squarebmd.ctx.rect(0, 0, 32, 32);
    this.squarebmd.ctx.fillStyle = '#fff';
    this.squarebmd.ctx.fill();
  },
  create: function() {
    this.matchTiles = this.game.add.group();
    this.matchTiles.createMultiple(64, this.squarebmd);
    this.matchTiles.setAll('anchor.x', 0.5);
    this.matchTiles.setAll('anchor.y', 0.5);

    this.colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ffff, 0x00ff00];
  },
  initialBoard: function() {
    this.board = [];
    for(var i = 0; i < 8;i++) {
      var line = [];
      var output = [];
      for(var j = 0; j < 8;j++) {
        // line.push(this.game.rnd.between(0, 4));
        var num = this.game.rnd.between(0, 4);
        var gTile = this.matchTiles.getFirstDead();
        gTile.row = i;
        gTile.col = j;
        gTile._id = this.idCount;
        gTile.spriteNum = num;
        gTile.tint = this.colors[num];
        gTile.inputEnabled = true;
        gTile.events.onInputDown.add(this.clickTile, this);

        //Draw the internal arrays vertically with the 0 index at the bottom
        // gTile.reset(540-i*64,620-j*64);
        gTile.reset(i*64+170, 540-j*64);
        line.push(gTile);
        output.push(gTile.spriteNum);
        this.idCount++;
      }
      // console.log(output);
      this.board.push(line);
    }
    this.removeMatches();
    return this.board;
  },
  removeMatches: function() {
    for(var i = 0; i < 8;i++) {
      // var line = '';
      for(var j = 0; j < 8;j++) {
        // while ((this.horizontalMatch(i, j)) || (this.verticalMatch(i, j))) {
        // while (this.horizontalMatch(i, j))  {
        var cTile = this.board[i][j];
        while ((this.horizontalMatch(cTile).length > 0) || (this.verticalMatch(cTile).length > 0))  {
          //Randomize color on match
          var num = this.game.rnd.between(0, 4);
          this.board[i][j].spriteNum = num;
          this.board[i][j].tint = this.colors[num];
        }
        // line += this.board[i][j].spriteNum;
      }
      // console.log(line);
    }
  },
  horizontalMatch: function(cTile) {
    var pos = this.getPosition(cTile);
    if(pos.i === 0 || pos.i === 7) {
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
    if(pos.j === 0 || pos.j === 7) {
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
    for(var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        var cTile = this.board[i][j];
        if (cTile.alive) {
          matches = _.union(matches, this.horizontalMatch(cTile),this.verticalMatch(cTile));
        }
      }
    }
    return matches;
  },
  scoreMatches: function() {
    var matches = this.getMatches();
    console.log('matches'+matches);
    for(var i = 0; i < 8; i++) {
      for(var j = 0; j < 8; j++) {
        var cTile = this.board[i][j];
        if (matches.indexOf(cTile._id) > -1) {
          cTile.kill();
        }
      }
    }
    return matches.length;

  },
  clickTile:  function(clickedTile) {
    if (this.selectedTile === null) {
      //Tile Clicked
      this.selectedTile = clickedTile; 
      console.log('row = '+clickedTile.row + ' col:'+clickedTile.col);
    }else if (clickedTile.row === this.selectedTile.row && clickedTile.col === this.selectedTile.col) {
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

      console.log('the score = '+ this.highScore);  

      this.selectedTile = null;
      console.log('is adjacent');
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
    // rewind = typeof rewind !== 'undefined' ? rewind : false;
    
    var f = this.game.add.tween(firstTile).to({x: secondTile.x, y: secondTile.y},300).start();
    var s = this.game.add.tween(secondTile).to({x: firstTile.x, y: firstTile.y},300).start();
    var firstPos = this.getPosition(firstTile);
    var secondPos = this.getPosition(secondTile);
    console.log('position of firstTile = '+ firstPos.i + ' '+ firstPos.j );

    firstTile.row = secondPos.i;
    firstTile.col = secondPos.j;

    secondTile.row = firstPos.i;
    secondTile.col = firstPos.j ;

    this.board[firstPos.i][firstPos.j] = secondTile;
    this.board[secondPos.i][secondPos.j] = firstTile;
    
    f.onComplete.add(function() {
      if (this.rewind === false) {
        var score = this.scoreMatches(); 
        if (score === 0) {
          //If no match is found reverse the last move
          this.swapPositions(firstTile, secondTile); 
          this.rewind = true;
        }else {
          this.highScore += score;
          this.redrawBoard();
        }
        // this.scoreMatches();
      }else {
        this.rewind = false;
      }
    }, this); 

    //Loop For Debugging Remove Later
    for(var i = 0;i < 8;i++) {
      line = "";
      for(var j = 0;j < 8;j++) {
        line += this.board[i][j].spriteNum+' ';
      }
      console.log(line);
    }
  },
  redrawBoard: function() {
    //Remove Dead Items from array
    for(var i = 0; i < 8; i++) {
      line = [];
      var deadCounter = 0;
      for(var j = 0; j < this.board[i].length;j++) {

        var hpos = 540-j*64 + (deadCounter*64);

        if (this.board[i][j].alive === true) {
          if (this.board[i][j].y !== hpos) {

            console.log('y'+this.board[i][j].y+ ' hpos'+hpos);

            var t = this.game.add.tween(this.board[i][j]).to({y: hpos},300).start();
            var temp = this.board[i][j];
            this.board[i][j-deadCounter] = temp;
          }
        }else {
          deadCounter += 1;
        }
      }
       console.log(line);
    }

   },
  removeDead: function() {
  }, 
  getPosition: function(tile) {
    //Iterate through game board until the the tile is found
    //return it's position in the 2d array
    for(var i = 0; i < 8;i++) {
       for(var j = 0;j < 8;j++) {
         if (this.board[i][j]._id === tile._id) {
           return {i: i, j: j};
         }
       }
    }
    return {};  
  },
  isAdjacent: function(firstTile, secondTile) {
    console.log(secondTile.row + ' '+ firstTile.row);
    if ((secondTile.row === (firstTile.row + 1) || secondTile.row === (firstTile.row - 1)) && (secondTile.col === firstTile.col)) {
      //Tiles are Vertically Adjacent
      return true;
    }
    else if ((secondTile.col === (firstTile.col + 1) || secondTile.col === (firstTile.col - 1)) && (secondTile.row === firstTile.row)) {
      return true;
    }

    return false;
  },

};
