import React from 'react';
import { Component } from 'react';

import { Button } from '../components/buttons.js';
import { MetanodeChip } from '../components/chips.js';

import './filter-button.css';

// filter button component
export class FilterButton extends Component {
  // display component
  render() {
    console.log(this.props.active);
    return (
      <Button
        className='node_search_filter_button'
        disabled={!this.props.active}
        tooltipText={this.props.tooltipText}
        onClick={() => this.props.toggle(this.props.name)}
        onCtrlClick={() => this.props.solo(this.props.name)}
      >
        <MetanodeChip type={this.props.name} />
        {this.props.name}
      </Button>
    );
  }
}
