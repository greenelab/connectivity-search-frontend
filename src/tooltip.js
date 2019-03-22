import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import Fade from '@material-ui/core/Fade';

import './tooltip.css';

export class Tooltip extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.open = false;
    this.state.x = 0;
    this.state.y = 0;
    this.state.opacity = 0;

    this.anchor = React.createRef();

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }
  onMouseOver() {
    const left =
      this.anchor.current.getBoundingClientRect().left + window.scrollX;
    const top =
      this.anchor.current.getBoundingClientRect().top + window.scrollY;

    this.setState({ open: true, x: left, y: top, opacity: 0.75 });
  }
  onMouseOut() {
    this.setState({ open: false, opacity: 0 });
  }
  render() {
    return (
      <>
        <span
          ref={this.anchor}
          className='tooltip_overlay'
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          {this.props.children}
        </span>
        {this.state.open && this.props.value && (
          <Portal
            value={this.props.value}
            open={this.state.open}
            x={this.state.x}
            y={this.state.y}
          />
        )}
      </>
    );
  }
}
class Portal extends Component {
  render() {
    return ReactDOM.createPortal(
      <Fade in={this.props.open}>
        <div
          key='really_unique_key'
          className='tooltip'
          style={{
            left: this.props.x + 'px',
            top: this.props.y + 'px'
          }}
        >
          {this.props.value}
        </div>
      </Fade>,
      document.body
    );
  }
}
