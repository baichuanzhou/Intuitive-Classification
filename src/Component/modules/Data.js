import React, { useEffect, useRef, useState } from "react";
import * as plt from "../../utils/plot.js";
import "./Data.css";
import * as dt from "../../utils/datasets";
import * as d3 from "d3";
import { createScatterPlot } from "../../utils/plot.js";
import * as tf from "@tensorflow/tfjs";


const Data = ( {datasetName, data} ) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    d3.select(svgElement).selectAll('*').remove();
    createScatterPlot(data.data, data.labels, svgElement).then(() => {});

  }, [datasetName, data]);
  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  )
}


const SPIRAL = dt.spiralData(200, 0.8);
const CIRCLE= dt.circleData(200, 0.1);
const XOR = dt.xorData(200, 0.1);
const GAUSSIAN = dt.gaussianData(200, 1);


const chooseDataSet = (name) => {
  if (name === "spiral") {
    return { data: SPIRAL[0], labels: SPIRAL[1] };
  } else if (name === "circle") {
    return { data: CIRCLE[0], labels: CIRCLE[1] };
  } else if (name === "xor") {
    return { data: XOR[0], labels: XOR[1] };
  } else if (name === "gaussian") {
    return { data: GAUSSIAN[0], labels: GAUSSIAN[1] };
  }
};

const DataSets = () => {
  return (
    <div>
      <header className="u-textCenter">DATA</header>
      <div className="Data-container">
        <Data dataset={"spiralData"} data={SPIRAL[0]} labels={SPIRAL[1]} />
        <Data dataset={"circleData"} data={CIRCLE[0]} labels={CIRCLE[1]} />
        <Data dataset={"xorData"} data={XOR[0]} labels={XOR[1]} />
        <Data dataset={"gaussianData"} data={GAUSSIAN[0]} labels={GAUSSIAN[1]} />
      </div>
    </div>
  )
}

export default DataSets;
export { Data };
export { chooseDataSet };