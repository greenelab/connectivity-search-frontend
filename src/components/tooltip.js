import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';

import './tooltip.css';

// open delay in ms
const delay = 500;

// tooltip (helper text) popup component
export class Tooltip extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.open = false;
    this.state.x = 0;
    this.state.y = 0;
    this.state.opacity = 0;

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.openTooltip = this.openTooltip.bind(this);
  }

  // when mouse enters target
  onMouseEnter(event) {
    const target = event.currentTarget;
    // delay opening tooltip
    window.setTimeout(() => this.openTooltip(target), delay);
    // track hover state
    this.setState({ hover: true });
  }

  // when mouse leaves target
  onMouseLeave() {
    this.setState({ hover: false, open: false });
  }

  // open tooltip
  openTooltip(target) {
    // if target not being hovered anymore, cancel open
    // if target not specified, exit
    if (!this.state.hover || !target) {
      this.setState({ open: false });
      return;
    }

    // get x/y position of target to pass to tooltip popup
    const left = target.getBoundingClientRect().left + window.scrollX;
    const top = target.getBoundingClientRect().top + window.scrollY;

    // open tooltip and update x/y position
    this.setState({ open: true, x: left, y: top });
  }

  // display component
  render() {
    // if no specified text, skip attaching events and render
    if (!this.props.text)
      return <>{this.props.children}</>;

    // mouse handler props to attach to children
    const props = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave
    };

    // attach handler props to children
    const children = React.Children.map(this.props.children, (element) => {
      // if element is react element, create clone with attached props
      if (React.isValidElement(element))
        return React.cloneElement(element, props);
      // if element is text node, wrap in span and attach props
      else if (typeof element === 'string')
        return <span {...props}>{element}</span>;
      // otherwise, pass element through untouched
      else
        return element;
    });

    return (
      <>
        {children}
        {this.state.open && (
          <Popup
            text={this.props.text}
            open={this.state.open}
            x={this.state.x}
            y={this.state.y}
          />
        )}
      </>
    );
  }
}

// popup component to display tooltip and text
// make React "portal" to append tooltip to body instead of parent
// (allows tooltip to pop out of containing elements like tables)
class Popup extends Component {
  render() {
    return ReactDOM.createPortal(
      <div
        className='tooltip'
        style={{
          left: this.props.x + 'px',
          top: this.props.y + 'px'
        }}
      >
        {this.props.text}
      </div>,
      document.body
    );
  }
}
