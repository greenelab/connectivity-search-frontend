import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Tooltip } from './tooltip.js';

// button component
export class Button extends Component {
  // display component
  render() {
    return (
      <Tooltip text={this.props.tooltipText}>
        <button
          className={this.props.className || ''}
          onClick={(event) => {
            if (event.ctrlKey) {
              if (this.props.onCtrlClick)
                this.props.onCtrlClick();
            } else if (event.shiftKey) {
              if (this.props.onShiftClick)
                this.props.onShiftClick();
            } else if (this.props.onClick)
              this.props.onClick();
          }}
          data-disabled={this.props.disabled}
        >
          {this.props.children}
        </button>
      </Tooltip>
    );
  }
}

// icon button component
// link colored button with text and icon to right
export class IconButton extends Component {
  // display component
  render() {
    return (
      <Button
        className={(this.props.className || '') + ' blue small'}
        tooltipText={this.props.tooltipText}
        onClick={this.props.onClick}
        onCtrlClick={this.props.onCtrlClick}
      >
        {this.props.text && <span>{this.props.text}</span>}
        <FontAwesomeIcon icon={this.props.icon} />
      </Button>
    );
  }
}
