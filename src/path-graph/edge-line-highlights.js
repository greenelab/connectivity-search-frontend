import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

export class GraphEdgeLineHighlights extends Component {
  render() {
    return <></>;
  }
}
// connect component to global state
GraphEdgeLineHighlights = connect((state) => ({
  graph: state.graph
}))(GraphEdgeLineHighlights);
