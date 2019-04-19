import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { Button } from './buttons.js';
import './collapsible-section.css';

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
        className='collapsible_section'
        data-collapsed={this.state.collapsed}
      >
        <Button
          tooltipText={this.props.tooltipText}
          className='collapsible_section_header'
          onClick={this.toggle}
        >
          <div>{this.props.label}</div>
          <FontAwesomeIcon
            icon={this.state.collapsed ? faAngleUp : faAngleDown}
          />
        </Button>
        {this.props.children}
      </div>
    );
  }
}
