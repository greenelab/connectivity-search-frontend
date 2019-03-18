import React from 'react';
import { Component } from 'react';

import { MetaTypes } from './metatypes.js';

export class Key extends Component {
  render() {
    let entries = MetaTypes.list();
    entries = entries.map((entry, index) => (
      <span className='key_entry' key={index}>
        <span className='metanode_chip' data-metanode={entry.name}>
          {entry.abbreviation}
        </span>{' '}
        {entry.name}
      </span>
    ));
    return (
      <section>
        <h3>Key:</h3>
        {entries}
      </section>
    );
  }
}
