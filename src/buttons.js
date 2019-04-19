import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { Tooltip } from './tooltip.js';
import './buttons.css';

// button component
export class Button extends Component {
  // display component
  render() {
    return (
      <Tooltip text={this.props.tooltipText}>
        <button
          className={this.props.className}
          onClick={(event) => {
            if (event.ctrlKey) {
              if (this.props.onCtrlClick)
                this.props.onCtrlClick();
            } else if (this.props.onClick)
              this.props.onClick();
          }}
        >
          {this.props.children}
        </button>
      </Tooltip>
    );
  }
}

// text button component
// link colored button with text and icon to right
export class TextButton extends Component {
  // display component
  render() {
    return (
      <Button
        className='text_button small'
        tooltipText={this.props.tooltipText}
        onClick={this.props.onClick}
        onCtrlClick={this.props.onCtrlClick}
      >
        {this.props.text}
        <FontAwesomeIcon icon={this.props.icon} className='text_button_icon' />
      </Button>
    );
  }
}
