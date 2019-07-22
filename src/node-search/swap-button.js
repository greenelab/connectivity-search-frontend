import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../components/buttons.js';
import { swapSourceTargetNode } from './actions.js';

import './round-button.css';

// swap button component
// switches source/target node
export class SwapButton extends Component {
  // when user clicks button
  onClick = () => {
    if (this.props.sourceNode.id || this.props.targetNode.id)
      this.props.dispatch(swapSourceTargetNode());
  };

  // display component
  render() {
    return (
      <Button
        tooltipText='Swap source and target node'
        className='node_search_round_button'
        onClick={this.onClick}
      >
        <FontAwesomeIcon icon={faExchangeAlt} />
      </Button>
    );
  }
}
// connect component to global state
SwapButton = connect((state) => ({
  sourceNode: state.sourceNode,
  targetNode: state.targetNode
}))(SwapButton);
