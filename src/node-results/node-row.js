import React from 'react';
import { Component } from 'react';

import { Tooltip } from '../components/tooltip.js';
import { DynamicField } from '../components/dynamic-field.js';

// node row component
// contains one row of information
export class NodeRow extends Component {
  // display component
  render() {
    return (
      <tr>
        <td className='small light'>
          <Tooltip text={this.props.tooltipText}>{this.props.firstCol}</Tooltip>
        </td>
        <td>
          <DynamicField value={this.props.secondCol} className='left' />
        </td>
      </tr>
    );
  }
}
