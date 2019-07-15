import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { CollapsibleSection } from '../components/collapsible-section.js';
import { MetapathAttic } from './metapath-attic.js';
import { MetapathTable } from './metapath-table.js';

// path results section component
export class MetapathResults extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.showMore = false;
  }

  toggleShowMore = (event) => {
    if (event)
      event.preventDefault();

    this.setState({ showMore: !this.state.showMore });
  };

  // display component
  render() {
    return (
      <CollapsibleSection
        label='Metapaths'
        tooltipText='Metapaths of length <= 3 between the source and target node'
      >
        {this.props.metapaths.length > 0 && (
          <MetapathAttic
            showMore={this.state.showMore}
            toggleShowMore={this.toggleShowMore}
          />
        )}
        {this.props.metapaths.length > 0 && (
          <MetapathTable showMore={this.state.showMore} />
        )}
        {this.props.metapaths.length === 0 && (
          <span className='light'>select a source and target node</span>
        )}
      </CollapsibleSection>
    );
  }
}
// connect component to global state
MetapathResults = connect((state) => ({
  metapaths: state.metapaths
}))(MetapathResults);
