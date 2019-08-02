import React from 'react';
import { Component } from 'react';

import { Button } from 'hetio-frontend-components';
import { MetanodeChip } from '../components/chips.js';

import './filter-button.css';

// filter button component
export class FilterButton extends Component {
  // display component
  render() {
    return (
      <Button
        className='node_search_filter_button'
        disabled={!this.props.active}
        tooltipText={this.props.tooltipText + ' Ctrl+click to solo.'}
        onClick={() => this.props.toggle(this.props.name)}
        onCtrlClick={() => this.props.solo(this.props.name)}
      >
        <MetanodeChip type={this.props.name} />
        {this.props.name}
      </Button>
    );
  }
}
