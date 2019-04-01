import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import Fade from '@material-ui/core/Fade';

import './tooltip.css';

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

    // a surrounding element that acts as detection box for mouse hover
    this.hitbox = React.createRef();

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  // when mouse enters hitbox
  onMouseOver() {
    // get x/y position of hitbox to pass to tooltip popup
    const left =
      this.hitbox.current.getBoundingClientRect().left;
    const top =
      this.hitbox.current.getBoundingClientRect().top;

    // open tooltip and update x/y position
    this.setState({ open: true, x: left, y: top });
  }

  // when mouse leaves hitbox
  onMouseLeave() {
    this.setState({ open: false });
  }

  // display component
  render() {
    return (
      <>
        <span
          ref={this.hitbox}
          className='tooltip_hitbox'
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        >
          {this.props.children}
        </span>
        {this.state.open && this.props.text && (
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
// make React 'portal' to append tooltip to body instead of parent
// (allows tooltip to pop out of containing elements like tables)
class Popup extends Component {
  render() {
    return ReactDOM.createPortal(
      <Fade in={this.props.open}>
        <div
          className='tooltip'
          style={{
            left: this.props.x + 'px',
            top: this.props.y + 'px'
          }}
        >
          {this.props.text}
        </div>
      </Fade>,
      document.body
    );
  }
}
