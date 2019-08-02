import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceThree } from '@fortawesome/free-solid-svg-icons';

import { Button } from 'hetio-frontend-components';
import { fetchRandomNodePair } from './actions.js';

import './round-button.css';

// random button component
// picks random source/target node with metapaths
export class RandomButton extends Component {
  // when user clicks button
  onClick = () => {
    this.props.dispatch(fetchRandomNodePair());
  };

  // display component
  render() {
    return (
      <Button
        tooltipText='Get random source/target node pair that has at least one
        precomputed metapath result'
        className='node_search_round_button'
        onClick={this.onClick}
      >
        <FontAwesomeIcon icon={faDiceThree} />
      </Button>
    );
  }
}
// connect component to global state
RandomButton = connect()(RandomButton);
