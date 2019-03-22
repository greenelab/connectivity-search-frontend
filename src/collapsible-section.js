import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import './collapsible-section.css';

export class CollapsibleSection extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.state.collapsed = false;
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }
  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed });
  }
  render() {
    return (
      <div
        className={'collapsible_section ' + (this.props.className || '')}
        data-collapsed={this.state.collapsed}
      >
        <button
          className='collapsible_section_header'
          onClick={this.toggleCollapsed}
        >
          <div>{this.props.label}</div>
          <FontAwesomeIcon
            icon={this.state.collapsed ? faAngleDown : faAngleUp}
          />
        </button>
        {this.props.children}
      </div>
    );
  }
}
