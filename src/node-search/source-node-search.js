import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { SearchBox } from './search-box.js';

// source node search box component
export class SourceNodeSearch extends Component {
  // when user makes a new node selection
  onChange = (value) => {
    // this.props.dispatch(updateSourceTargetNodes({ sourceNode: value }));
    // unfocus search box on selection
    if (value)
      document.activeElement.blur();
  }

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
SourceNodeSearch = connect((state) => ({
  node: state.sourceNode,
  otherNode: state.targetNode
}))(SourceNodeSearch);
