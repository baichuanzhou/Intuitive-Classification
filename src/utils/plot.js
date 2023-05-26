import * as d3 from 'd3';
import * as tf from '@tensorflow/tfjs';

async function createScatterPlot(dataArr, labelArr, svgElement, width, height, r, setStroke, showAxis=true) {
  const margin = { top: 20, right: 30, bottom: 20, left: 20 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const svg = d3.select(svgElement)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let x = d3.scaleLinear()
    .domain([-6, 6])
    .range([0, width]);

  let y = d3.scaleLinear()
    .domain([-6, 6])
    .range([height, 0]);

  if (showAxis) {
    svg.append("g")
      .attr("transform", `translate(${width}, 0)`)
      .call(d3.axisRight(y));
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
  }

  svg.selectAll('circle')
    .data(dataArr)
    .enter()
    .append('circle')
    .attr('cx', d => Math.abs((d[0])) <= 6 ? x(d[0]) : x(6 * d[0] / Math.abs(d[0])))
    .attr('cy', d => Math.abs((d[1])) <= 6 ? y(d[1]) : y(6 * d[1] / Math.abs(d[1])))
    .attr('r', r)
    .style('fill', (d, i) => orangeWhiteBlue(labelArr[i]));

  if (setStroke) {
    svg.selectAll("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 0.1)
  }
}

async function createRects(dataArr, labelArr, svgElement, width, height, r, setStroke) {
  const margin = { top: 20, right: 30, bottom: 20, left: 20 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const svg = d3.select(svgElement)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let x = d3.scaleLinear()
    .domain([-6, 6])
    .range([0, width]);

  let y = d3.scaleLinear()
    .domain([-6, 6])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(${width}, 0)`)
    .call(d3.axisRight(y));
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.selectAll('rect')
    .data(dataArr)
    .enter()
    .append('rect')
    .attr('x', d => Math.abs((d[0])) <= 6 ? x(d[0]) : x(6 * d[0] / Math.abs(d[0])))
    .attr('y', d => Math.abs((d[1])) <= 6 ? y(d[1]) : y(6 * d[1] / Math.abs(d[1])))
    .attr('width', r * 2)
    .attr('height', r * 2)
    .style('fill', (d, i) => lighterOrangeWhiteBlue(labelArr[i]));

  if (setStroke) {
    svg.selectAll("rect")
      .attr("stroke", "white")
      .attr("stroke-width", 0.1)
  }
}

async function createRectsCanvas(dataArr, labelArr, canvasElement, width, height, r, setStroke, circles, circlesLabel) {
  const margin = { top: 20, right: 30, bottom: 20, left: 20 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const canvas = d3.select(canvasElement)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const ctx = canvas.node().getContext('2d');
  ctx.translate(margin.left, margin.top);

  const x = d3.scaleLinear()
    .domain([-6, 6])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([-6, 6])
    .range([height, 0]);


  dataArr.forEach((d, i) => {
    const xPos = Math.abs((d[0])) <= 6 ? x(d[0]) : x(6 * d[0] / Math.abs(d[0]));
    const yPos = Math.abs((d[1])) <= 6 ? y(d[1]) : y(6 * d[1] / Math.abs(d[1]));

    ctx.fillStyle = orangeWhiteBlue(labelArr[i]);
    ctx.fillRect(xPos, yPos, r * 2, r * 2);

    if (setStroke) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.1;
      ctx.strokeRect(xPos, yPos, r * 2, r * 2);
    }
  });

  circles.forEach((d, i) => {
    const xPos = Math.abs((d[0])) <= 6 ? x(d[0]) : x(6 * d[0] / Math.abs(d[0]));
    const yPos = Math.abs((d[1])) <= 6 ? y(d[1]) : y(6 * d[1] / Math.abs(d[1]));

    ctx.fillStyle = orangeWhiteBlue(circlesLabel[i]);


    ctx.beginPath();
    ctx.arc(xPos, yPos, 3, 0, 2 * Math.PI);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.fill();
  });


}

async function createCirclesCanvas(dataArr, labelArr, canvasElement, width, height, r, setStroke) {
  const margin = { top: 20, right: 30, bottom: 20, left: 20 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const canvas = d3.select(canvasElement)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const ctx = canvas.node().getContext('2d');
  ctx.translate(margin.left, margin.top);

  const x = d3.scaleLinear()
    .domain([-6, 6])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([-6, 6])
    .range([height, 0]);



  dataArr.forEach((d, i) => {
    const xPos = Math.abs((d[0])) <= 6 ? x(d[0]) : x(6 * d[0] / Math.abs(d[0]));
    const yPos = Math.abs((d[1])) <= 6 ? y(d[1]) : y(6 * d[1] / Math.abs(d[1]));

    ctx.fillStyle = orangeWhiteBlue(labelArr[i]);

    ctx.beginPath();
    ctx.arc(xPos, yPos, r, 0, 2 * Math.PI);

    if (setStroke) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.fill();

  });
}

const orangeWhiteBlue = (t) => {
  const orangeWhite = d3.interpolate('orange', 'white');
  const whiteBlue = d3.interpolate('white', 'steelblue');
  if (t < 0) {
    t = 0;
  }
  if (t > 1) {
    t = 1;
  }
  return t < 0.5 ? orangeWhite(t * 2) : whiteBlue((t - 0.5) * 2);
};

const lighterOrangeWhiteBlue = (t) => {
  const orangeWhite = d3.interpolate('#FFC78E', '#e8eaeb');
  const whiteBlue = d3.interpolate('#e8eaeb', '#97BDD3');


  return t < 0.5 ? orangeWhite(t * 2) : whiteBlue((t - 0.5) * 2);
};

export { createScatterPlot, createRects, createRectsCanvas, createCirclesCanvas };