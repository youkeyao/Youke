const tf = require('@tensorflow/tfjs-node');

class Net {
  constructor(lr=0.002, width=8, height=8) {
    this.optimizer = tf.train.adam(lr);

    const input = tf.input({shape: [4, width, height]});
    // common layer
    const conv1 = tf.layers.conv2d({
      filters: 32,
      kernelSize: [3, 3],
      activation: 'relu',
      padding: 'same',
      dataFormat: 'channelsLast'
    }).apply(input);
    const conv2 = tf.layers.conv2d({
      filters: 64,
      kernelSize: [3, 3],
      activation: 'relu',
      padding: 'same',
      dataFormat: 'channelsLast'
    }).apply(conv1);
    const conv3 = tf.layers.conv2d({
      filters: 128,
      kernelSize: [3, 3],
      activation: 'relu',
      padding: 'same',
      dataFormat: 'channelsLast'
    }).apply(conv2);
    // action layer
    const actionConv = tf.layers.conv2d({
      filters: 4,
      kernelSize: [1, 1],
      activation: 'relu',
      padding: 'same',
      dataFormat: 'channelsLast'
    }).apply(conv3);
    const actionConvFlat = tf.layers.flatten().apply(actionConv);
    const actionFC = tf.layers.dense({units: width*height, activation: 'softmax'}).apply(actionConvFlat);
    // evaluation layer
    const evaluationConv = tf.layers.conv2d({
      filters: 2,
      kernelSize: [1, 1],
      activation: 'relu',
      padding: 'same',
      dataFormat: 'channelsLast'
    }).apply(conv3);
    const evaluationConvFlat = tf.layers.flatten().apply(evaluationConv);
    const evaluationFC1 = tf.layers.dense({units: 64, activation: 'softmax'}).apply(evaluationConvFlat);
    const evaluationFC2 = tf.layers.dense({units: 1, activation: 'tanh'}).apply(evaluationFC1);

    this.model = tf.model({inputs: input, outputs: [actionFC, evaluationFC2]});
  }

  convBlock(inputTensor, kernelSize, filters, stage, block, strides=[2, 2]) {
    const [filters1, filters2, filters3] = filters;
    const x1 = tf.layers.conv2d({
      filters: filters1,
      kernelSize: [1, 1],
      strides: strides,
    }).apply(inputTensor);
    const x2 = tf.layers.conv2d({
      filters: filters1,
      kernelSize: [1, 1],
      strides: strides,
    }).apply(inputTensor);
  }

  predict(obs) {
    return this.model.apply(tf.tensor4d([obs]));
  }

  train(states, mctsProbs, rewards) {
    tf.tidy(() => {
      states = tf.tensor4d(states);
      mctsProbs = tf.tensor2d(mctsProbs);
      rewards = tf.tensor2d(rewards, [rewards.length, 1]);
      this.optimizer.minimize(() => {
        const [actProb, value] = this.model.apply(states);
        const valueLoss = tf.losses.meanSquaredError(rewards, value);
        const policyLoss = tf.neg(tf.mean(tf.sum(tf.mul(tf.log(actProb), mctsProbs), 1)));
        console.log(valueLoss.arraySync() + policyLoss.arraySync());
        return tf.add(valueLoss, policyLoss);
      });
    })
  }

  save(path) {
    return this.model.save(path);
  }

  async load(path) {
    try {
      this.model = await tf.loadLayersModel(path);
    }
    catch(err) {
      console.log(err);
    }
  }
}

module.exports = Net;