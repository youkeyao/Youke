const tf = require('@tensorflow/tfjs-node');
const GoBang = require('./env');
const Net = require('./net');
const MCTSPlayer = require('./mcts');

class ReplayBuffer {
  states = [];
  mctsProbs = [];
  rewards = [];
  maxSize = 5000;
  batchSize = 256;

  push(state, mctsProb, reward) {
    if (this.states.length >= this.maxSize) {
      this.states.shift();
      this.mctsProbs.shift();
      this.rewards.shift();
    }
    this.states.push(state);
    this.mctsProbs.push(mctsProb);
    this.rewards.push(reward);
  }

  sample() {
    const sampleIndexs = new Set();
    while (sampleIndexs.size < Math.min(this.batchSize, this.states.length)) {
      sampleIndexs.add(Math.floor(Math.random() * this.states.length));
    }
    const state = [], mctsProb = [], reward = [];
    for (const i of sampleIndexs) {
      state.push(this.states[i]);
      mctsProb.push(this.mctsProbs[i]);
      reward.push(this.rewards[i]);
    }
    return [state, mctsProb, reward];
  }
}

async function main() {
  const last = 70;

  const replayBuffer = new ReplayBuffer();
  const net = new Net();
  await net.load(`file://./AI/model-${last}/model.json`);
  const player = new MCTSPlayer((o) => net.predict(o), 225, 5, 400, true);
  let episode = last;
  
  while (true) {
    const game = new GoBang();
    const buf = [];
    while (!game.isEnd) {
      const [move, mctsProbs] = player.getAction(game, 0.0001, true);
      buf.push([game.getObs(), mctsProbs]);
      game.step(move);
    }
    for (let b of buf) {
      replayBuffer.push(b[0], b[1], game.score);
    }
    if (replayBuffer.states.length > replayBuffer.batchSize) {
      net.train(...replayBuffer.sample());
      episode ++;
      if (episode % 100 === 0) {
        await net.save(`file://./AI/model-${episode}`);
      }
    }
  }
}

main();