import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import './collapsible-section.css';
import { Tooltip } from './tooltip.js';

// accordion (collapse/expand) section component
export class CollapsibleSection extends Component {
  // initialize component
  constructor(props) {
    super();

    this.state = {};
    this.state.collapsed = false;

    this.toggle = this.toggle.bind(this);
  }

  // toggle collapse/expand
  toggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  // display component
  render() {
    return (
      <div
        className={'collapsible_section ' + (this.props.className || '')}
        data-collapsed={this.state.collapsed}
      >
        <Tooltip text={this.props.tooltipText}>
          <button className='collapsible_section_header' onClick={this.toggle}>
            <div>{this.props.label}</div>
            <FontAwesomeIcon
              icon={this.state.collapsed ? faAngleDown : faAngleUp}
            />
          </button>
        </Tooltip>
        {this.props.children}
      </div>
    );
  }
}
