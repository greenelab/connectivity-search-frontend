import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import './graph.css';

const minZoom = 0.25;
const maxZoom = 4;
const nodeRadius = 25;
const nodeDistance = 100;
const nodeCharLimit = 25;
const nodeFontSize = 8;
const nodeRepulsion = 200;
const edgeFontSize = 8;
const edgeThickness = 2;
const edgeArrowSize = 10;
const edgeSpreadDistance = 20;
const edgeSpreadAngle = (45 / 360) * 2 * Math.PI;
const inkColor = '#424242';
const backgroundColor = '#fafafa';
const highlightColor = '#ffcc00';

// graph component
export class Graph extends Component {
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

    // title text
    const title =
      (this.props.sourceNode.name || '___') +
      ' → ' +
      (this.props.targetNode.name || '___');

    // description text
    const description = [
      'Graph visualization of the connectivity between ',
      this.props.sourceNode.name || '___',
      ' (',
      this.props.sourceNode.metanode || '___',
      ') and ',
      this.props.targetNode.name || '___',
      ' (',
      this.props.targetNode.metanode || '___',
      '). ',
      '\n\n',
      'Created at ',
      window.location.href,
      '\n\n',
      'This subgraph of Hetionet v1.0 was created from paths between the ',
      'specified source/target nodes that occurred more than expected ',
      'by chance. ',
      'See https://het.io for more information. '
    ].join('');

    return (
      <div id='graph_container' style={{ height: this.props.height }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          id='graph'
          width={this.props.width}
          height={this.props.height}
          style={{ left: left }}
        >
          <title>{title}</title>
          <desc>{description}</desc>
          <defs>
            <style>
              {`
            @import url('https://fonts.googleapis.com/css?family=Raleway:400,500,700');
            @import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,700&text=0123456789');
            * {
              font-family: 'Montserrat', 'Raleway', sans-serif;
            }
          `}
            </style>
            <marker
              id='graph_arrowhead'
              viewBox='0 0 100 100'
              refX='80'
              refY='50'
              orient='auto'
              markerUnits='userSpaceOnUse'
              markerWidth={edgeArrowSize}
              markerHeight={edgeArrowSize}
            >
              <path
                d='
              M 0 0
              L 100 50
              L 0 100'
                fill={inkColor}
              />
            </marker>
          </defs>
          <g id='graph_view'>
            <g id='graph_edge_line_highlight_layer' />
            <g id='graph_node_circle_highlight_layer' />
            <g id='graph_edge_line_layer' />
            <g id='graph_edge_label_layer' />
            <g id='graph_node_circle_layer' />
            <g id='graph_node_label_layer' />
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
