import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Tooltip } from './tooltip.js';

// styles from global.css on het.io

// button component
export class Button extends Component {
  // initialize component
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  // when user clicks button
  onClick(event) {
    if (event.ctrlKey) {
      if (this.props.onCtrlClick)
        this.props.onCtrlClick();
    } else if (event.shiftKey) {
      if (this.props.onShiftClick)
        this.props.onShiftClick();
    } else if (this.props.onClick)
      this.props.onClick();
  }

  // when user presses down on button
  onMouseDown(event) {
    if (event.button === 0 && this.props.onMouseDown)
      this.props.onMouseDown(event);
  }

  // when user moves mouse across button
  onMouseMove(event) {
    if (this.props.onMouseMove)
      this.props.onMouseMove(event);
  }

  // when user releases button
  onMouseUp(event) {
    if (event.button === 0 && this.props.onMouseUp)
      this.props.onMouseUp(event);
  }

  // display component
  render() {
    return (
      <Tooltip text={this.props.tooltipText}>
        <button
          className={this.props.className || ''}
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
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
// icon gets the attribute data-checked to allow desired CSS styling
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
        <FontAwesomeIcon
          icon={this.props.icon}
          data-checked={this.props.checked}
        />
      </Button>
    );
  }
}
