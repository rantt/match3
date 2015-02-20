var MatchThree = function(game) {
  this.game = game;
  this.board = [];
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

    // var colors = {red: 0xff0000, blue: 0x0000ff, yellow: 0xffff00, cyan: 0x00ffff, green: 0x00ff00};
    this.colors = [0xff0000, 0x0000ff, 0xffff00, 0x00ffff, 0x00ff00];
  },
  initialBoard: function() {
    this.board = []
    for(var i = 0; i < 8;i++) {
      var line = [];
      for(var j = 0; j < 8;j++) {
        line.push(this.game.rnd.between(0, 4));
      }
      this.board.push(line);
    }
    this.removeMatches();
    return this.board;
  },
  removeMatches: function() {
    for(var i = 0; i < 8;i++) {
      for(var j = 0; j < 8;j++) {
        while ((this.horizontalMatch(i, j)) || (this.verticalMatch(i, j))) {
          this.board[j][i] = this.game.rnd.between(0, 4);
        }
      }
    }
  },
  horizontalMatch: function(row, col) {
    if(col === 0 || col === 7) {
      return;
    }
    var curTile = this.board[col][row];
    var prevTile = this.board[col - 1][row];
    var nextTile = this.board[col + 1][row];

    if (curTile === prevTile && curTile === nextTile) {
      console.log('horizontal match at col:'+col+' row:'+row + 'matching ='+prevTile+' '+curTile+' '+nextTile);
      return true;
    }
    return false;
  },
  verticalMatch: function(row, col) {
    if(row === 0 || row === 7) {
      return;
    }
    var curTile = this.board[col][row];
    var prevTile = this.board[col][row-1];
    var nextTile = this.board[col][row+1];

    if (curTile === prevTile && curTile === nextTile) {
      console.log('vertical match at col:'+col+' row:'+row + 'matching ='+prevTile+' '+curTile+' '+nextTile);
      return true;
    }
    return false;
  },

  drawBoard: function() {
    for(var i = 0;i < 8;i++) {
      line = "";
      for(var j = 0;j < 8;j++) {
        var gTile = this.matchTiles.getFirstDead();
        // gTile.tint = colors[this.game.rnd.between(0,4)];
        gTile.tint = this.colors[this.board[i][j]];
        gTile.reset(i*64+170, j*64+70);
        line += this.board[i][j]+' ';
      }
      console.log(line);
    }
  }

};
