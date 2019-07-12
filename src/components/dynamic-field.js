import React from 'react';
import { Component } from 'react';

import './dynamic-field.css';

// expandable textbox-like component, similar to excel spreadsheet cell
// when focused, field expands and prop 'fullValue' displayed,
// otherwise, prop 'value' displayed (often 'fullValue' rounded off)
export class DynamicField extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.focused = false;
    this.field = React.createRef();

    this.onClick = this.onClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  // when field is clicked or touched
  onClick(event) {
    // force click on link in field if link was target of click
    if (event && event.target && event.target.tagName.toLowerCase() === 'a')
      event.target.click();
    // force focus on field
    this.field.current.focus();
  }

  // when field loses focus
  onBlur() {
    this.setState({ focused: false }, this.deselectAll);
  }

  // when field is focused (tabbed to, clicked, etc)
  onFocus() {
    this.setState({ focused: true }, this.selectAll);
  }

  // deselect any selected text in window
  deselectAll() {
    window.getSelection().empty();
  }

  // select contents of field
  selectAll() {
    // set delay for select to make sure component has rendered
    window.setTimeout(function() {
      window.getSelection().empty();
      window.getSelection().selectAllChildren(document.activeElement);
    }, 10);
  }

  // display component
  render() {
    let displayValue;

    // show full value if focused, or short value if not
    if (this.state.focused)
      displayValue = this.props.fullValue || this.props.value;
    else
      displayValue = this.props.value;

    // if value just text, set 'nowrap' to truncate with ellipsis
    if (typeof displayValue === 'string')
      displayValue = <span className='nowrap'>{displayValue}</span>;

    return (
      <div
        ref={this.field}
        tabIndex='0'
        onClick={this.onClick}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        className={'dynamic_field ' + (this.props.className || '')}
        data-expanded={this.state.focused}
      >
        {displayValue}
      </div>
    );
  }
}
