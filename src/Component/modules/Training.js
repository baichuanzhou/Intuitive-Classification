import React, { createRef, useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from '@tensorflow/tfjs-vis';
import * as d3 from 'd3';
import { createCirclesCanvas, createRects, createRectsCanvas, createScatterPlot } from "../../utils/plot";
import { getPartialModel, pca } from "../../utils/model";
import "./Training.css";
import { Button, TextField } from "@mui/material";

const DecisionBoundary = ( {model, epochCounter, meshGrid, data, update} ) => {
  const decisionBoundaryContainer = useRef(null);

  const showDecisionBoundary = async (model, canvasElement, meshGrid, data) => {

    const output = await model.predict(meshGrid);

    const canvas = d3.select(canvasElement);
    const ctx = canvas.node().getContext('2d');

    // Clear the entire canvas
    ctx.clearRect(0, 0, 400, 400);

    await createRectsCanvas(
      meshGrid.arraySync(),
      tf.slice(output, [0, 1], [-1, 1]).arraySync(),
      canvasElement,
      400,
      400,
      5.5,
      false,
      data.data,
      data.labels
    );

  }


  useEffect(() => {
    const canvas = decisionBoundaryContainer.current;

    showDecisionBoundary(model, canvas, meshGrid, data);

  }, [model, data, epochCounter, meshGrid, update])

  return (
    <div>
      <canvas ref={decisionBoundaryContainer} />
    </div>
  )
}

const LayerVis = ( {model, data, epochCounter, visLayer} ) => {
  const canvasRef = useRef(null);

  const [msg, setMsg] = useState("This layer is of shape 150 x 2 dimensions")

  const [selectedDim, setSelectedDim] = useState([0, 1]);

  const [selectedDimInput, setSelectedDimInput] = useState("0, 1");

  const handleInputChange = (event) => {
    setSelectedDimInput(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const dimInput = selectedDimInput
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    setSelectedDim(dimInput);
  }

  const showNonLinear = async (canvasElement, x, y) => {
    if (visLayer >= model.layers.length) {
      visLayer = 0;
    }
    const partialModel = getPartialModel(model, visLayer);
    let output = await partialModel.predict(x);
    setMsg("This layer is of shape " + output.shape[0] + " x " + output.shape[1]);
    const N = x.shape[0];
    if (Math.max(...selectedDim) < output.shape[1] && Math.min(...selectedDim) >= 0 && selectedDim[0] !== selectedDim[1]) {
      output = tf.concat(
        [tf.slice(output, [0, selectedDim[0]], [N, 1]),
          tf.slice(output, [0, selectedDim[1]], [N, 1])],
        1
      );
    }
    else {
      setSelectedDimInput("0, 1");
      setSelectedDim([0, 1]);
    }

    const canvas = d3.select(canvasElement);
    const ctx = canvas.node().getContext('2d');

    // Clear the entire canvas
    ctx.clearRect(0, 0, 400, 400);

    await createCirclesCanvas(
      output.arraySync(),
      y.arraySync(),
      canvasElement,
      400,
      400,
      3,
      true
    );

  }

  useEffect( () => {
    const canvasElement = canvasRef.current;
    const x = tf.tensor2d(data.data, [200, 2]);
    const y = tf.tensor1d(data.labels, 'int32');
    showNonLinear(canvasElement, x, y);
  }, [model, data, epochCounter]);

  return (
    <div>
      <canvas ref={canvasRef} />
      <text>{msg}</text>
      <div className={"SelectedDim"}>
        <TextField label={"Selected Dimension"} defaultValue={selectedDimInput} onChange={ handleInputChange } size={"small"}/>
        <Button variant={"outlined"} onClick={ handleSubmit } size={"medium"}>Change</Button>
      </div>
    </div>
  )
}




const Training = ( {model, data, layerIndex} ) => {
  const lossContainer = useRef(null);

  const svgContainer = useRef(Array.from({ length: model.layers.length - 1 }).map(() => createRef()));

  const decisionBoundaryContainer = useRef(null);

  const [epochCounter, setEpochCounter] = useState(0);

  if (layerIndex >= model.layers.length) {
    layerIndex = 0;
  }

  const [output, setOutput] = useState(getPartialModel(model, layerIndex).predict(tf.tensor2d(data.data, [200, 2])));

  // first we generate the xx, yy, zz
  const xMesh = tf.linspace(-5.5, 5.5, 50);
  const yMesh = tf.linspace(-5.5, 5.5, 50);

  // mesh grid the x and y
  const [xx, yy] = tf.meshgrid(xMesh, yMesh);

  // concat the two tensors together
  const [meshGrid, setMeshGrid] = useState(tf.stack([xx.reshape([-1]), yy.reshape([-1])], 1));

  const [updateDecision, setUpdateDecision] = useState(true);

  const update = async (model, svgElements, lossElement, history, x, y, label) => {
    await model.fit(x, label, {
        epochs: 1,
        batchSize: 40,
        validationSplit: 0.1,
        callbacks: {
          onEpochEnd: (epoch, log) => {
            history.push(log);
          }
        }
      }
    );


    await setEpochCounter(prevState => prevState + 1);

    await tfvis.show.history(lossElement, history, ['loss', 'acc'],
    {
        height: 200,
        width: 250,
    }
    );


  }

  useEffect(() => {
    const history = [];

    const lossElement = lossContainer.current;

    let x = tf.tensor2d(data.data, [200, 2]);
    let y = tf.tensor1d(data.labels, 'int32');

    const shuffleIndices = tf.tensor1d(Array.prototype.concat.apply([],tf.util.createShuffledIndices(x.shape[0])), 'int32');

    x = tf.gather(x, shuffleIndices, 0);
    y = tf.gather(y, shuffleIndices, 0);

    setOutput(getPartialModel(model, layerIndex).predict(tf.tensor2d(data.data, [200, 2])));

    const label = tf.oneHot(y, 2);

    // first we generate the xx, yy, zz
    const xMesh = tf.linspace(-5.5, 5.5, 80);
    const yMesh = tf.linspace(-5.5, 5.5, 80);

    // mesh grid the x and y
    const [xx, yy] = tf.meshgrid(xMesh, yMesh);

    // concat the two tensors together
    setMeshGrid(tf.stack([xx.reshape([-1]), yy.reshape([-1])], 1));

    const intervalId = setInterval(async () => {
      await update(model, svgContainer, lossElement, history, x, y, label);
      // await showDecisionBoundary(model, decisionBoundaryElement, meshGrid);
    }, 100); // update every one tenth of a second


    return () => {
      clearInterval(intervalId);
      // tf.dispose(model);
      setEpochCounter(0);
      // tf.dispose(model);
    }; // clear the interval on unmount

  }, [model, data])

  return (
    <>
      <div className={"Visualizer-container"}>
        <LayerVis epochCounter={epochCounter} model={model} data={data} output={output} visLayer={layerIndex} />
        <div ref={ lossContainer } />
        <DecisionBoundary model={model} epochCounter={epochCounter} meshGrid={meshGrid} data={data} update={updateDecision}/>
      </div>
    </>
  );
}

export default Training;