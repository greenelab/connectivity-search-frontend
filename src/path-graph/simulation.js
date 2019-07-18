import * as d3 from 'd3';

import { positionNode, positionEdge, positionEdgeLabel } from './position.js';

import { nodeDistance, nodeRadius, nodeRepulsion } from './constants.js';

export function createSimulation() {
  // create physics simulation for nodes to detangle and prettify layout
  const simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink()
        .distance(nodeDistance)
        .id((d) => d.neo4j_id)
    )
    .force(
      'collide',
      d3
        .forceCollide()
        .radius(nodeRadius)
        .strength(1)
    )
    .force('charge', d3.forceManyBody().strength(-nodeRepulsion));
  simulation.on('tick', onSimulationTick);
  return simulation;
}

// when simulation ticks forward
function onSimulationTick() {
  // position all elements in graph
  d3.selectAll('.graph_edge_line_highlight').each(positionEdge);
  d3.selectAll('.graph_edge_line').each(positionEdge);
  d3.selectAll('.graph_edge_label').each(positionEdgeLabel);
  d3.selectAll('.graph_node_circle_highlight').each(positionNode);
  d3.selectAll('.graph_node_circle').each(positionNode);
  d3.selectAll('.graph_node_label').each(positionNode);
}
