import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { SearchBox } from './search-box.js';

// source node search box component
export class TargetNodeSearch extends Component {
  // when user makes a new node selection
  onChange = (value) => {
    // this.props.dispatch(updateSourceTargetNodes({ targetNode: value }));
    // unfocus search box on selection
    if (value)
      document.activeElement.blur();
  }

  // display component
  render() {
    return (
      <SearchBox
        label='Target Node'
        tooltipText='The ending node of the paths'
        node={this.props.node}
        otherNode={this.props.otherNode}
        onChange={this.onChange}
      />
    );
  }
}
// connect component to global state
TargetNodeSearch = connect((state) => ({
  node: state.targetNode,
  otherNode: state.sourceNode
}))(TargetNodeSearch);
