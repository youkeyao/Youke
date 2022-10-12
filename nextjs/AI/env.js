class GoBang {
  obs = null;
  lastObs = null;
  width = 8;
  height = 8;
  turn = 1;
  lastMove = {
    '1': null,
    '-1': null
  };
  isEnd = false;
  score = 0;

  constructor(width=8, height=8, turn=1) {
    this.obs = Array.from(Array(width), _ => Array(height).fill(0));
    this.lastObs = Array.from(Array(width), _ => Array(height).fill(0));
    this.width = width;
    this.height = height;
    this.turn = turn;
  }

  copy() {
    const newGoBang = new GoBang(this.width, this.height, this.turn);
    for (let i = 0; i < this.width; i ++) {
      for (let j = 0; j < this.height; j ++) {
        newGoBang.obs[i][j] = this.obs[i][j];
      }
    }
    return newGoBang;
  }

  step(move) {
    move = JSON.parse(move);
    const x = Math.floor(move / this.height);
    const y = move % this.height;
    if (0 > x || x >= this.width || 0 > y || y >= this.height) {
      console.warn('invalid input');
      return;
    }
    this.obs[x][y] = this.turn;
    this.lastMove[this.turn.toString()] = [x, y];
    this.turn = -this.turn;

    this.judgeEnd();
  }

  isValid(move) {
    move = JSON.parse(move);
    const x = Math.floor(move / this.height);
    const y = move % this.height;
    return 0 <= x && x < this.width && 0 <= y && y < this.height && !this.obs[x][y];
  }

  getObs() {
    const me = Array.from(Array(this.width), _ => Array(this.height).fill(0));
    const oppo = Array.from(Array(this.width), _ => Array(this.height).fill(0));
    const lastMe = Array.from(Array(this.width), _ => Array(this.height).fill(0));
    const lastOppo = Array.from(Array(this.width), _ => Array(this.height).fill(0));
    for (let i = 0; i < this.width; i ++) {
      for (let j = 0; j < this.height; j ++) {
        if (this.obs[i][j] === this.turn) {
          me[i][j] = 1;
          const k = this.turn.toString();
          if (!(this.lastMove[k] && this.lastMove[k][0] === i && this.lastMove[k][1] === j)) {
            lastMe[i][j] = 1;
          }
        }
        else if (this.obs[i][j] === -this.turn) {
          oppo[i][j] = 1;
          const k = (-this.turn).toString();
          if (!(this.lastMove[k] && this.lastMove[k][0] === i && this.lastMove[k][1] === j)) {
            lastOppo[i][j] = 1;
          }
        }
      }
    }
    return [me, oppo, lastMe, lastOppo];
  }

  judgeEnd() {
    let full = true;
    const memo = Array.from(Array(this.width), _ => Array(this.height).fill(0));
    for (let i = 0; i < this.width; i ++) {
      for (let j = 0; j < this.height; j ++) {
        if (memo[i][j]) continue;
        if (this.obs[i][j]) {
          let row = i, col = j;
          let count = 0;
          // row
          while (--row >= 0 && this.obs[row][j] === this.obs[i][j]);
          while (++row < this.width && this.obs[row][j] === this.obs[i][j]) {
            count ++;
            memo[row][j] = 1;
          }
          if (count >= 5) {
            this.isEnd = true;
            this.score = this.obs[i][j];
            return;
          }
          count = 0;
          // col
          while (--col >= 0 && this.obs[i][col] === this.obs[i][j]);
          while (++col < this.height && this.obs[i][col] === this.obs[i][j]) {
            count ++;
            memo[i][col] = 1;
          }
          if (count >= 5) {
            this.isEnd = true;
            this.score = this.obs[i][j];
            return;
          }
          count = 0;
          // row+, col+
          row = i;
          col = j;
          while (row >= 0 && col >= 0 && this.obs[row][col] === this.obs[i][j]) {
            row --;
            col --;
          }
          while (++row < this.width && ++col < this.height && this.obs[row][col] === this.obs[i][j]) {
            count ++;
            memo[row][col] = 1;
          }
          if (count >= 5) {
            this.isEnd = true;
            this.score = this.obs[i][j];
            return;
          }
          count = 0;
          // row-, col+
          row = i;
          col = j;
          while (row < this.width && col >= 0 && this.obs[row][col] === this.obs[i][j]) {
            row ++;
            col --;
          }
          while (--row >= 0 && ++col < this.height && this.obs[row][col] === this.obs[i][j]) {
            count ++;
            memo[row][col] = 1;
          }
          if (count >= 5) {
            this.isEnd = true;
            this.score = this.obs[i][j];
            return;
          }
        }
        else {
          full = false;
        }
      }
    }
    if (full) {
      this.isEnd = true;
      this.score = 0;
    }
  }

  getScore(turn) {
    return this.score === 0 ? 0 : (this.score === turn ? 1 : -1)
  }

  printEnv() {
    for (let i = 0; i < this.width; i ++) {
      let str = '';
      for (let j = 0; j < this.height; j ++) {
        str += this.obs[i][j] > 0 ? 'o' : (this.obs[i][j] < 0 ? 'x' : '-');
      }
      console.log(str);
    }
    console.log('');
  }
}

module.exports = GoBang;