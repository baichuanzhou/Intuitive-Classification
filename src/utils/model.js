const tf = require("@tensorflow/tfjs");
const PCA = require('pca-js');
const { tensor2d } = require("@tensorflow/tfjs");

function createModel(learningRate, optimizer, normalization, initialization, activation, loss, hiddenLayers) {
  if (optimizer === "SGD") {
    optimizer = tf.train.sgd(learningRate);
  }
  else if (optimizer === "Adam") {
    optimizer = tf.train.adam(learningRate);
  }
  else if (optimizer === "Momentum") {
    optimizer = tf.train.momentum(learningRate, 0.9);
  }
  else if (optimizer === "Nesterov") {
    optimizer = tf.train.momentum(learningRate, 0.9, true);
  }
  else {
    optimizer = tf.train.rmsprop(learningRate);
  }

  const model = tf.sequential(
    {
      layers: [
        tf.layers.inputLayer({ inputShape: [2], name: "input" }),
      ]
    }
  );

  let layers = [2].concat(hiddenLayers);
  layers = layers.concat([2]);
  layers.forEach((d, i) => {
    if (i > 0) {
      model.add(tf.layers.dense({
        inputShape: layers[i - 1],
        units: d,
        batchSize: 40,
        kernelInitializer: initialization,
        name: "fc" + i
      }));
      // Normalization Layer
      if (normalization === "Batch Norm") {
        model.add(tf.layers.batchNormalization({ name: "BN" + i }));
      } else if (normalization === "Layer Norm") {
        model.add(tf.layers.layerNormalization({ name: "LN" + i }));
      }
      if (i !== layers.length - 1) {
        model.add(tf.layers.activation({ activation: activation, name: activation + i }));
      }

    }
  })
  if (loss === 'categoricalCrossentropy') {
    model.add(tf.layers.softmax({name: "softmax"}));
  }

  // Compile the model
  model.compile({
    optimizer: optimizer,
    loss: loss,
    metrics: ['accuracy']
  });
  model.summary();
  console.log(layers);
  return model;
}

function getPartialModel(model, index) {
  const layer = model.getLayer("", index);
  return tf.model(
    {
      inputs: model.inputs,
      outputs: layer.output
    }
  )
}

function pca(data, topK) {
  /*
    Input: data is an N x M matrix that needs to be PCAed.
           topK is the first K principal component
    return: an N x topK matrix
   */
  const dataArray = data.arraySync();
  let vectors = PCA.getEigenVectors(dataArray);
  let adData = PCA.computeAdjustedData(dataArray, vectors[0], vectors[1]);
  const transformed = adData["adjustedData"];
  return tf.tensor2d(transformed);
}

module.exports = { createModel, getPartialModel, pca };