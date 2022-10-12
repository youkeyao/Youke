const tf = require('@tensorflow/tfjs-node');

function randomChoose(p) {
  let sum = 0;
  for (let i of p) {
    sum += i;
  }
  let prob = Math.random() * sum;
  let count = 0;
  for (let i in p) {
    if (prob < count + p[i]) {
      return i;
    }
    count += p[i];
  }
}

class TreeNode {
  constructor(parent, prior_P) {
    this.parent = parent;
    this.children = {};
    this.nVisits = 0;
    this.Q = 0;
    this.u = 0;
    this.P = prior_P;
  }

  expand(action, prob) {
    if (!this.children[action]) {
      this.children[action] = new TreeNode(this, prob);
    }
  }

  select(cPuct) {
    let act = Object.keys(this.children)[0];
    let max = this.children[act].getValue(cPuct);
    for (let action in this.children) {
      let value = this.children[action].getValue(cPuct);
      if (value > max) {
        max = value;
        act = action;
      }
    }
    return [act, this.children[act]];
  }

  update(leafValue) {
    if (this.parent) {
      this.parent.update(-leafValue);
    }
    this.nVisits += 1;
    this.Q += 1.0 * (leafValue - this.Q) / this.nVisits;
  }

  getValue(cPuct) {
    this.u = (cPuct * this.P * Math.sqrt(this.parent.nVisits) / (1 + this.nVisits));
    return this.Q + this.u;
  }

  isLeaf() {
    return Object.keys(this.children).length === 0;
  }

  isRoot() {
    return !this.parent;
  }
}

class MCTS{
  constructor(policy, actionDim, cPuct=5, nPlayout=10000) {
    this.root = new TreeNode(null, 1);
    this.policy = policy;
    this.actionDim = actionDim;
    this.cPuct = cPuct;
    this.nPlayout = nPlayout;
  }

  playout(game) {
    let node = this.root;
    let action;
    while (!node.isLeaf()) {
      [action, node] = node.select(this.cPuct);
      game.step(action);
    }
    let [actProb, leafValue] = this.policy(game.getObs());
    leafValue = leafValue.arraySync()[0];

    if (!game.isEnd) {
      const probs = actProb.arraySync()[0];
      for (let a in probs) {
        if (game.isValid(a)) {
          node.expand(a, probs[a]);
        }
      }
    }
    else {
      leafValue = game.getScore(game.turn);
    }
    node.update(-leafValue);
  }

  getMoveProbs(game, temp=0.001) {
    for (let i = 0; i < this.nPlayout; i ++) {
      const gameCopy = game.copy();
      this.playout(gameCopy);
    }
    const visits = Array.from({ length: this.actionDim }, (_, k) => {
      if (this.root.children[k]) {
        return this.root.children[k].nVisits;
      }
      return 0;
    });
    const probs = tf.softmax(tf.log(tf.tensor1d(visits).add(1e-10)).mul(1.0/temp)).arraySync();

    return probs;
  }

  updateWithMove(move) {
    if (this.root.children[move]) {
      this.root = this.root.children[move];
      this.root.parent = null;
    }
    else {
      this.root = new TreeNode(null, 1);
    }
  }
}

class MCTSPlayer {
  constructor(policy, actionDim, cPuct=5, nPlayout=2000, isSelfPlay=false) {
    this.mcts = new MCTS(policy, actionDim, cPuct, nPlayout);
    this.isSelfPlay = isSelfPlay;
  }

  getAction(game, temp=0.001, returnProb=false) {
    if (!game.isEnd) {
      return tf.tidy(() => {
        const probs = this.mcts.getMoveProbs(game, temp);
        let move = 0;
        if (this.isSelfPlay) {
          move = randomChoose(probs);
          this.mcts.updateWithMove(move);
        }
        else {
          let max = -1;
          for (let i in probs) {
            if (probs[i] > max) {
              max = probs[i];
              move = i;
            }
          }
          this.mcts.updateWithMove(-1);
        }
        if (returnProb) {
          return [move, probs];
        }
        return [move];
      });
    }
  }
}

module.exports = MCTSPlayer;