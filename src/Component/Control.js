import { useEffect, useState } from "react";
import ControlPanel from "./modules/ControlPanel.js";
import React from "react";
import { chooseDataSet, Data } from "./modules/Data";
import "../utilities.css";
import { createModel } from "../utils/model";
import Training from "./modules/Training";
import * as tf from "@tensorflow/tfjs";
import { alignProperty } from "@mui/material/styles/cssUtils";





const Control = () => {
  const [selectedValues, setSelectedValues] = useState(
    {
      learningRate: 0.01,
      optimizer: "Momentum",
      normalization: "None",
      initialization: "heNormal",
      activation: "relu",
      loss: "categoricalCrossentropy",
      dataset: "spiral",
      hiddenLayers: [8],
    }
  )

  const [model, setModel] = useState(createModel(
    selectedValues.learningRate,
    selectedValues.optimizer,
    selectedValues.normalization,
    selectedValues.initialization,
    selectedValues.activation,
    selectedValues.loss,
    selectedValues.hiddenLayers
  ));

  const [data, setData] = useState(chooseDataSet(selectedValues.dataset));
  const [visLayer, setVisLayer] = useState(model.layers.length - 2);

  useEffect(() => {
    const newModel = createModel(
      selectedValues.learningRate,
      selectedValues.optimizer,
      selectedValues.normalization,
      selectedValues.initialization,
      selectedValues.activation,
      selectedValues.loss,
      selectedValues.hiddenLayers
      );
    setModel(newModel);
    setData(chooseDataSet(selectedValues.dataset));

  }, [selectedValues])

  const handleValueChange = (name, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    console.log(name, value);
  }

  const handleVisLayerChange = (value) => {
    setVisLayer(value);
  }

  return (
    <>
      <ControlPanel selectedValues={selectedValues} onValueChange={handleValueChange} model={model} onVisLayerChange={handleVisLayerChange} visLayer={visLayer} />
      <Training model={model} data={data} layerIndex={visLayer} />
    </>
  )
}




export default Control;