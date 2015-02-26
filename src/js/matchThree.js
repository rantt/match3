var MatchThree = function(game, width, height) {
  this.game = game;
  this.boardWidth = width;
  this.boardHeight = height;
  this.board = [];
  this.selectedTile = null;
  this.idCount = 0;
  this.highScore = 0;
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
      console.log(output);
      this.board.push(line);
    }
    this.removeMatches();
    return this.board;
  },
  removeMatches: function() {
    for(var i = 0; i < 8;i++) {
      // var line = '';
      for(var j = 0; j < 8;j++) {
        while ((this.horizontalMatch(i, j)) || (this.verticalMatch(i, j))) {
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
  horizontalMatch: function(row, col) {
    if(col === 0 || col === 7) {
      return;
    }

    var curTile = this.board[row][col];
    var prevTile = this.board[row][col - 1];
    var nextTile = this.board[row][col + 1];

    if (curTile.spriteNum === prevTile.spriteNum && curTile.spriteNum === nextTile.spriteNum) {
      return true;
    }
    return false;
  },
  verticalMatch: function(row, col) {
    if(row === 0 || row === 7) {
      return;
    }
    var curTile = this.board[row][col];
    var prevTile = this.board[row - 1][col];
    var nextTile = this.board[row + 1][col];

    if (curTile.spriteNum === prevTile.spriteNum && curTile.spriteNum === nextTile.spriteNum) {
      return true;
    }
    return false;
  },

  score: function(tile, total, visited) {
    // Visit all connected tiles of the same color return count of all matches 
    var row = tile.row;
    var col = tile.col;

    // console.log('above = '+ this.board[row - 1][col].spriteNum + 'prev'+direction);
    // console.log('below = '+ this.board[row + 1][col].spriteNum + 'prev'+direction);
    console.log('vis'+visited);
    console.log('tile._id'+tile._id);
    // console.log('vistile'+visited.push(tile._id));

    var above,below,left,right,finish = true;
    if (visited.indexOf(tile._id) === -1) {
      visited.push(tile._id);
      console.log('vis'+visited);
      if (row > 0 ) {
        above = this.board[row - 1][col];
        if (above.spriteNum === tile.spriteNum) {
          finish = false;
          this.score(above, total + 1, visited );
        }
      }
      if (row < 8) {
        below = this.board[row + 1][col];
        if (below.spriteNum === tile.spriteNum) {
          finish = false;
          this.score(below, total + 1, visited);
        }
      }
     if (col > 0) {
        left = this.board[row][col - 1];
        if (left.spriteNum === tile.spriteNum) {
          finish = false;
          this.score(left, total + 1, visited);
        }
     } 
     if (col < 8) {
       right = this.board[row][col + 1];
       if (right.spriteNum === tile.spriteNum) {
         finish = false;
         this.score(right, total + 1, visited);
       }
     }
    }

    console.log('visited len'+visited.length);
    return visited.length;
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
      this.swapPositions(this.selectedTile, clickedTile); 

      //check vertical or horizontal matches
      var cScore = this.score(this.selectedTile, 0, []);
      var sScore = this.score(clickedTile, 0, []);
      if (cScore > 2) {
        this.highScore += cScore;
      }
      if (sScore > 2) {
        this.highScore += sScore;
      }

      // this.highScore += cScore + sScore;

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
    
    var f = this.game.add.tween(firstTile).to({x: secondTile.x, y: secondTile.y},600).start();
    var s = this.game.add.tween(secondTile).to({x: firstTile.x, y: firstTile.y},600).start();
    var firstPos = this.getPosition(firstTile);
    var secondPos = this.getPosition(secondTile);
    console.log('position of firstTile = '+ firstPos.i + ' '+ firstPos.j );

    firstTile.row = secondPos.i;
    firstTile.col = secondPos.j;

    secondTile.row = firstPos.i;
    secondTile.col = firstPos.j ;

    this.board[firstPos.i][firstPos.j] = secondTile;
    this.board[secondPos.i][secondPos.j] = firstTile;
    // var tileTemp = firstTile; 
    // var rowTemp  = firstTile.row;
    // var colTemp  = firstTile.col;
    //
    // firstTile.row = secondTile.row;
    // firstTile.col = secondTile.col;
    //
    // secondTile.row = rowTemp;
    // secondTile.col = colTemp;
    //
    // this.board[firstTile.row][firstTile.col] = secondTile;
    // this.board[secondTile.row][secondTile.col] = tempTile;
    //
    // //Update Board
    // // console.log('sprite num ' + firstTile.spriteNum + ' ' + secondTile.spriteNum);
    for(var i = 0;i < 8;i++) {
      line = "";
      for(var j = 0;j < 8;j++) {
        line += this.board[i][j].spriteNum+' ';
      }
      console.log(line);
    }
  },
  getPosition: function(tile) {
    for(var i = 0; i < 8;i++) {
       console.log(this.board[i]);
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
