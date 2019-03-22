import React from 'react';
import { Component } from 'react';

import './dynamic-field.css';

export class DynamicField extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.focused = false;

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }
  expand(event) {
    if (event && event.target)
      event.target.click();

    this.setState({ focused: true }, this.selectFocusedElement);
  }
  collapse(event) {
    if (
      event &&
      event.relatedTarget &&
      event.target &&
      event.target.contains(event.relatedTarget)
    )
      event.relatedTarget.click();

    this.setState({ focused: false });
  }
  selectFocusedElement() {
    if (document.activeElement.matches('.dynamic_field'))
      window.getSelection().selectAllChildren(document.activeElement);
  }
  render() {
    return (
      <div
        tabIndex='0'
        onFocus={this.expand}
        onBlur={this.collapse}
        className={'dynamic_field ' + (this.props.className || '')}
        data-expanded={this.state.focused}
      >
        {!this.state.focused && this.props.value}
        {this.state.focused && (this.props.fullValue || this.props.value)}
      </div>
    );
  }
}
