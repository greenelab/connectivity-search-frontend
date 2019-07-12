import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

import { Button } from './buttons.js';

// swap button component
// switches source/target node
export class SwapButton extends Component {
  // when user clicks button
  onClick = () => {
    // this.props.dispatch(swapSourceTargetNodes());
  };

  // display component
  render() {
    return (
      <Button
        tooltipText='Swap source and target node'
        className='node_search_swap_button'
        onClick={this.onClick}
      >
        <FontAwesomeIcon icon={faExchangeAlt} />
      </Button>
    );
  }
}
// connect component to global state
SwapButton = connect()(SwapButton);
