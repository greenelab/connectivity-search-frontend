import * as d3 from 'd3';

import { store } from '../index.js';

import { gridSpacing } from './constants.js';

// create node drag handler
export function createNodeDragHandler(simulation) {
  console.log('createNodeDragHandler')
  const nodeDragHandler = d3
    .drag()
    .on('drag', onNodeDrag)
    .on('start', () => onNodeDragStart(simulation))
    .on('end', () => onNodeDragEnd(simulation));
  return nodeDragHandler;
}

// when node dragged by user
function onNodeDragStart(simulation) {
  simulation.alphaTarget(1).restart();
}

// when node dragged by user
function onNodeDrag(d) {
  console.log('onNodeDrag')
  let newX = d3.event.x;
  let newY = d3.event.y;

  // snap to grid
  if (store.getState().showGrid) {
    newX = Math.round(newX / gridSpacing) * gridSpacing;
    newY = Math.round(newY / gridSpacing) * gridSpacing;
  }

  d.fx = newX;
  d.fy = newY;
}

// when node dragged by user
function onNodeDragEnd(simulation) {
  simulation.alphaTarget(0).restart();
}
