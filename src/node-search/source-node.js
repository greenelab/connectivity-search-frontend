import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { SearchBox } from './search-box.js';
import { setSourceTargetNode } from './actions.js';

// source node search box component
export class SourceNode extends Component {
  // when user makes a new node selection
  onChange = (value) => {
    this.props.dispatch(
      setSourceTargetNode({ sourceNode: value, updateUrl: true })
    );
    // unfocus search box on selection
    if (value)
      document.activeElement.blur();
  };

  // display component
  render() {
    return (
      <SearchBox
        label='Source Node'
        tooltipText='The starting node of the paths'
        node={this.props.node}
        otherNode={this.props.otherNode}
        onChange={this.onChange}
      />
    );
  }
}
// connect component to global state
SourceNode = connect((state) => ({
  node: state.sourceNode,
  otherNode: state.targetNode
}))(SourceNode);
