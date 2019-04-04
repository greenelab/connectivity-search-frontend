import React from 'react';
import { Component } from 'react';

// page header display component
export class Header extends Component {
  // display component
  render() {
    return (
      <header>
        <h1>HETMECH</h1>
        <h2>
          A project of the{' '}
          <a href='http://www.greenelab.com/'>Greene Laboratory</a>
        </h2>
      </header>
    );
  }
}
