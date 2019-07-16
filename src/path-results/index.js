import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { CollapsibleSection } from '../components/collapsible-section.js';
import { PathAttic } from './path-attic.js';
import { PathTable } from './path-table.js';

// path results section component
export class PathResults extends Component {
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
        label='Paths'
        tooltipText='Paths of length <= 3 between the source and target node'
      >
        {this.props.paths.length > 0 && (
          <PathAttic
            showMore={this.state.showMore}
            toggleShowMore={this.toggleShowMore}
          />
        )}
        {this.props.paths.length > 0 && (
          <PathTable showMore={this.state.showMore} />
        )}
        {this.props.paths.length === 0 && (
          <span className='light'>select a metapath</span>
        )}
      </CollapsibleSection>
    );
  }
}
// connect component to global state
PathResults = connect((state) => ({
  paths: state.paths
}))(PathResults);
