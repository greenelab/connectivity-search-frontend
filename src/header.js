import React from 'react';
import { Component } from 'react';

import { ReactComponent as Logo } from './logo-animated.svg';

// page header display component
export class Header extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.showLogo = false;

    // wait a bit for page to load before starting logo animation
    window.setTimeout(() => this.setState({ showLogo: true }), 1000);
  }

  // display component
  render() {
    let logo;

    if (this.state.showLogo)
      logo = <Logo className='logo' />;
    else
      logo = <svg className='logo' />;
    return (
      <header>
        {logo}
        <h1>HETMECH</h1>
        <h2>
          A project of the{' '}
          <a href='http://www.greenelab.com/'>Greene Laboratory</a>
        </h2>
      </header>
    );
  }
}
