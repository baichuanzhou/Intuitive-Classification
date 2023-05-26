import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, TextField } from "@mui/material";
import * as tf from '@tensorflow/tfjs';
import "./ControlPanel.css";
import * as dt from "../../utils/datasets";
import { useEffect, useState } from "react";

const LearningRateSelector = ({learningRate, onChange}) => {
  // const [learningRate, setLearningRate] = React.useState(0.01);
  //
  // const handleChange = (event) => {
  //   setLearningRate(event.target.value);
  // };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Learning Rate</InputLabel>
        <Select
          value={learningRate}
          onChange={onChange}
          label="Learning Rate"
        >
          <MenuItem value={0.0001}>0.0001</MenuItem>
          <MenuItem value={0.001}>0.001</MenuItem>
          <MenuItem value={0.005}>0.005</MenuItem>
          <MenuItem value={0.01}>0.01</MenuItem>
          <MenuItem value={0.03}>0.03</MenuItem>
          <MenuItem value={0.05}>0.05</MenuItem>
          <MenuItem value={0.1}>0.1</MenuItem>
          <MenuItem value={0.3}>0.3</MenuItem>
          <MenuItem value={0.5}>0.5</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

const OptimizerSelector = ({optimizer, onChange}) => {
  // const [optimizer, setOptimizer] = React.useState("SGD");
  //
  // const handleChange = (event) => {
  //   setOptimizer(event.target.value);
  // };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Optimizer</InputLabel>
        <Select
          value={optimizer}
          onChange={onChange}
          label="Optimizer"
        >
          <MenuItem value={"Momentum"}>Momentum</MenuItem>
          <MenuItem value={"Adam"}>Adam</MenuItem>
          <MenuItem value={"SGD"}>SGD</MenuItem>
          <MenuItem value={"RMSProp"}>RMSProp</MenuItem>
          <MenuItem value={"Nesterov"}>Nesterov</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

const NormalizationSelector = ({normalization, onChange}) => {
  // const [normalization, setNormalization] = React.useState("None");
  //
  // const handleChange = (event) => {
  //   setNormalization(event.target.value);
  // };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Normalization</InputLabel>
        <Select
          value={normalization}
          onChange={onChange}
          label="Normalization"
        >
          <MenuItem value={"None"} function={null}>None</MenuItem>
          <MenuItem value={"Batch Norm"}>Batch Norm</MenuItem>
          <MenuItem value={"Layer Norm"}>Layer Norm</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

const InitializationSelector = ({initialization, onChange}) => {
  // const [initialization, setInitialization] = React.useState("Kaiming");
  //
  // const handleChange = (event) => {
  //   setInitialization(event.target.value);
  // };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Initialization</InputLabel>
        <Select
          value={initialization}
          onChange={onChange}
          label="Initialization"
        >
          <MenuItem value={"heNormal"}>Kaiming</MenuItem>
          <MenuItem value={"leCunNormal"}>LeCun</MenuItem>
          <MenuItem value={"randomNormal"}>Random Normal</MenuItem>
          <MenuItem value={"zeros"}>Zero</MenuItem>
          <MenuItem value={"ones"}>One</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

const ActivationSelector = ({activation, onChange}) => {

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Activation</InputLabel>
        <Select
          value={activation}
          onChange={onChange}
          label="Activation"
        >
          <MenuItem value={"relu"}>ReLU</MenuItem>
          <MenuItem value={"tanh"}>Tanh</MenuItem>
          <MenuItem value={"sigmoid"}>Sigmoid</MenuItem>
          <MenuItem value={"linear"}>Linear</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

const LossSelector = ({ loss, onChange }) => {
  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Loss</InputLabel>
        <Select
          value={loss}
          onChange={onChange}
          label="DataSet"
        >
          <MenuItem value={"categoricalCrossentropy"}>Cross Entropy</MenuItem>
          <MenuItem value={"meanSquaredError"}>Mean Squared</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

const DataSetSelector = ({ dataset, onChange }) => {

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Dataset</InputLabel>
        <Select
          value={dataset}
          onChange={onChange}
          label="DataSet"
        >
          <MenuItem value={"spiral"}>Spiral Data</MenuItem>
          <MenuItem value={"circle"}>Circle Data</MenuItem>
          <MenuItem value={"gaussian"}>Gaussian Data</MenuItem>
          <MenuItem value={"xor"}>XOR Data</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

const HiddenLayersInput = ( {onChange} ) => {
  const [hiddenLayersInput, setHiddenLayersInput] = useState("8");

  const handleInputChange = (event) => {
    setHiddenLayersInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const hiddenLayers = hiddenLayersInput
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    onChange(hiddenLayers);
  };

  return (
    <div className={"HiddenLayerInput"}>
      <TextField label={"Hidden Layers"} defaultValue={hiddenLayersInput} onChange={ handleInputChange } size={"small"}/>
      <Button variant={"outlined"} onClick={ handleSubmit } size={"medium"}>Change</Button>
    </div>
  )
}

const VisLayerSelector = ( {visLayer, model, onChange} ) => {
  const [layerOptions, setLayerOptions] = useState(Array.from({ length: model.layers.length }, (_, index) => (
    <MenuItem key={index} value={index}>
      {model.getLayer('', index).name}
    </MenuItem>
  )));

  useEffect(() =>{

    setLayerOptions(Array.from({ length: model.layers.length }, (_, index) => (
      <MenuItem key={index} value={index}>
        {model.getLayer('', index).name}
      </MenuItem>
    )));
  }, [model])

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Visualize Layer</InputLabel>
        <Select
          value={visLayer}
          onChange={onChange}
          label="Visual Layer"
        >
          {layerOptions}
        </Select>
      </FormControl>
    </div>
  )
}

const ControlPanel = ( {selectedValues, onValueChange, model, onVisLayerChange, visLayer} ) => {
  const handleLearningRateChange = (event) => {
    onValueChange("learningRate", event.target.value);
  };

  const handleOptimizerChange = (event) => {
    onValueChange("optimizer", event.target.value);
  };

  const handleNormalizationChange = (event) => {
    if (model.layers.length >= visLayer) {
      onVisLayerChange(0);
    }
    onValueChange("normalization", event.target.value);
  };

  const handleInitializationChange = (event) => {
    onValueChange("initialization", event.target.value);
  };

  const handleActivationChange = (event) => {
    onValueChange("activation", event.target.value);
  };

  const handleLossChange = (event) => {
    if (model.layers.length >= visLayer) {
      onVisLayerChange(0);
    }
    onValueChange("loss", event.target.value);
  }

  const handleDatasetChange = (event) => {
    onValueChange("dataset", event.target.value);
  };

  const handleHiddenLayersChange = (value) => {
    if (value.length >= visLayer) {
      onVisLayerChange(0);
    }
    onValueChange("hiddenLayers", value);
  }

  const handleVisLayerChange = (event) => {
    if (event.target.value < model.layers.length) {
      onVisLayerChange(event.target.value);
    }
    else {
      onVisLayerChange(0);
    }
  }

  return (
    <div className="ControlPanel">
      <LearningRateSelector learningRate={selectedValues.learningRate} onChange={handleLearningRateChange}/>
      <OptimizerSelector optimizer={selectedValues.optimizer} onChange={handleOptimizerChange}/>
      <NormalizationSelector normalization={selectedValues.normalization} onChange={handleNormalizationChange}/>
      <InitializationSelector initialization={selectedValues.initialization} onChange={handleInitializationChange}/>
      <ActivationSelector activation={selectedValues.activation} onChange={handleActivationChange}/>
      <LossSelector loss={selectedValues.loss} onChange={handleLossChange} />
      <DataSetSelector dataset={selectedValues.dataset} onChange={handleDatasetChange}/>
      <VisLayerSelector onChange={handleVisLayerChange} model={model} visLayer={visLayer} />
      <HiddenLayersInput onChange={handleHiddenLayersChange} />
    </div>
  )
}


export default ControlPanel;
