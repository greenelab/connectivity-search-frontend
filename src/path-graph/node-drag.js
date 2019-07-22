import * as d3 from 'd3';

// create node drag handler
export function createNodeDragHandler(simulation) {
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
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

// when node dragged by user
function onNodeDragEnd(simulation) {
  simulation.alphaTarget(0).restart();
}
