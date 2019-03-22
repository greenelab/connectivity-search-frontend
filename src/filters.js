import React from 'react';
import { Component } from 'react';

import './filters.css';

export class MetatypeFilters extends Component {
  render() {
    const buttons = [];
    for (const metatype of Object.keys(this.props.metatypeFilters)) {
      buttons.push(
        <button
          className='filter_button'
          data-active={String(this.props.metatypeFilters[metatype])}
          onClick={(event) => this.props.toggleMetatypeFilter(metatype, event)}
          key={metatype}
        >
          <div className='metanode_chip' data-metatype={metatype} />
          {metatype}
        </button>
      );
    }
    return <section className='center'>{buttons}</section>;
  }
}
