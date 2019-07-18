import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import { GraphDefs } from './defs.js';
import { GraphEdgeLineHighlights } from './edge-line-highlights.js';
import { GraphNodeCircleHighlights } from './node-circle-highlights.js';
import { GraphEdgeLines } from './edge-lines.js';
import { GraphEdgeLabels } from './edge-labels.js';
import { GraphNodeCircles } from './node-circles.js';
import { GraphNodeLabels } from './node-labels.js';
import { minZoom, maxZoom } from './constants.js';

import './graph.css';

// graph component
export class Graph extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.nodeDragHandler = null;
  }
  // when component mounts
  componentDidMount() {
    const svg = d3.select('#graph');

    // create physics simulation for nodes to detangle and prettify layout
    // const simulation = d3
    //   .forceSimulation()
    //   .force(
    //     'link',
    //     d3
    //       .forceLink()
    //       .distance(nodeDistance)
    //       .id((d) => d.neo4j_id)
    //   )
    //   .force(
    //     'collide',
    //     d3
    //       .forceCollide()
    //       .radius(nodeRadius)
    //       .strength(1)
    //   )
    //   .force('charge', d3.forceManyBody().strength(-nodeRepulsion))
    //   .force('center', d3.forceCenter(0, 0));
    // simulation.on('tick', this.onSimulationTick);

    // create handler for panning and zooming view
    const viewZoomHandler = d3
      .zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', this.onViewZoom);
    svg.call(viewZoomHandler);

    // handle clicks on background
    svg.on('click', this.onViewClick);

    // create handler for dragging nodes
    const nodeDragHandler = d3
      .drag()
      .on('drag', this.onNodeDrag)
      .on('start', this.onNodeDragStart)
      .on('end', this.onNodeDragEnd);

    // store the above objects to be referenced on graph updates
    this.setState(
      {
        // simulation: simulation,
        viewZoomHandler: viewZoomHandler,
        nodeDragHandler: nodeDragHandler
      }
      // this.resetView
    );
  }

  // when view panned or zoomed by user
  onViewZoom = () => {
    d3.select('#graph_view').attr('transform', d3.event.transform);
  };

  // when node dragged by user
  onNodeDragStart = () => {
    // this.state.simulation.alphaTarget(1).restart();
  };

  // when node dragged by user
  onNodeDrag = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  // when node dragged by user
  onNodeDragEnd = () => {
    // this.state.simulation.alphaTarget(0).restart();
  };

  // when view/background is clicked by user
  onViewClick = () => {
    // this.deselectAll();
    // this.updateNodeCircles();
    // this.updateEdgeLines();
    // this.props.setSelectedElement(null);
  };

  // display component
  render() {
    // calculate x position of graph container
    let left = 0;
    if (this.props.sectionWidth && this.props.width) {
      left = this.props.sectionWidth / 2 - this.props.width / 2;
      const minLeft =
        this.props.sectionWidth / 2 - document.body.clientWidth / 2 + 20;
      if (left < minLeft)
        left = minLeft;
    }

    return (
      <div id='graph_container' style={{ height: this.props.height }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          id='graph'
          width={this.props.width}
          height={this.props.height}
          style={{ left: left }}
        >
          <GraphDefs />
          <g id='graph_view'>
            <g id='graph_edge_line_highlight_layer'>
              <GraphEdgeLineHighlights />
            </g>
            <g id='graph_node_circle_highlight_layer'>
              <GraphNodeCircleHighlights />
            </g>
            <g id='graph_edge_line_layer'>
              <GraphEdgeLines />
            </g>
            <g id='graph_edge_label_layer'>
              <GraphEdgeLabels />
            </g>
            <g id='graph_node_circle_layer'>
              <GraphNodeCircles nodeDragHandler={this.state.nodeDragHandler} />
            </g>
            <g id='graph_node_label_layer'>
              <GraphNodeLabels />
            </g>
          </g>
        </svg>
      </div>
    );
  }
}
// connect component to global state
Graph = connect(
  (state) => ({
    sourceNode: state.sourceNode,
    targetNode: state.targetNode
  }),
  null,
  null,
  { forwardRef: true }
)(Graph);
