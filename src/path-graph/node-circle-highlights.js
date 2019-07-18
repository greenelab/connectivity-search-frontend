import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

export class GraphNodeCircleHighlights extends Component {
  // when component updates
  componentDidUpdate() {
    this.update();
  }

  // update
  update = () => {};

  // display component
  render() {
    return <></>;
  }
}
// connect component to global state
GraphNodeCircleHighlights = connect((state) => ({
  graph: state.graph
}))(GraphNodeCircleHighlights);
