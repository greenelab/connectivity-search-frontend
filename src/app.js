import React from 'react';
import { Component } from 'react';

import { Header } from './header.js';
import { Key } from './key.js';
import { Search } from './search.js';

export class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Key />
        <Search />
      </div>
    );
  }
}

export default App;
