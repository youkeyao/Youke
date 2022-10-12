const tf = require('@tensorflow/tfjs-node');
const GoBang = require('./env');
const Net = require('./net');
const MCTSPlayer = require('./mcts');

class ReplayBuffer {
  states = [];
  mctsProbs = [];
  rewards = [];
  maxSize = 10000;
  batchSize = 512;

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

const format = (data) => (data / 1024 / 1024).toFixed(2) + "MB";
function printMemory() {
  const memory = process.memoryUsage();
  console.log(
    JSON.stringify({
      rss: format(memory.rss),
      heapTotal: format(memory.heapTotal),
      heapUsed: format(memory.heapUsed),
      external: format(memory.external)
    })
  );
}

async function main() {
  const replayBuffer = new ReplayBuffer();
  const net = new Net(0.001, 8, 8);
  await net.load(`file://./AI/best-model/model.json`);
  const player = new MCTSPlayer((o) => net.predict(o), 64, 5, 400, true);
  let episode = 0;
  
  while (true) {
    const game = new GoBang(8, 8);
    const buf = [];
    while (!game.isEnd) {
      const [move, mctsProbs] = player.getAction(game, 1, true);
      buf.push([game.getObs(), mctsProbs, game.turn]);
      game.step(move);
    }
    for (let b of buf) {
      replayBuffer.push(b[0], b[1], game.getScore(b[2]));
    }
    
    if (replayBuffer.states.length > replayBuffer.batchSize) {
      net.train(...replayBuffer.sample());
      episode ++;
      if (episode % 10 === 0) {
        await net.save(`file://./AI/best-model`);
      }
    }
    printMemory();
  }
}

main();