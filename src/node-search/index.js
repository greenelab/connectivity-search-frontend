import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Context } from './context.js';
import { Filters } from './filters.js';
import { SourceNode } from './source-node.js';
import { TargetNode } from './target-node.js';
import { SwapButton } from './swap-button.js';
import { RandomButton } from './random-button.js';
import { CollapsibleSection } from '../components/collapsible-section.js';

// node search section component
export class NodeSearch extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.filterString = '';
  }

  // update string of metanode abbreviations for search query filter param
  updateFilterString = (string) => {
    this.setState({ filterString: string });
  };

  // display component
  render() {
    return (
      <Context.Provider
        value={{
          filterString: this.state.filterString,
          updateFilterString: this.updateFilterString
        }}
      >
        <CollapsibleSection
          label='Node Search'
          tooltipText='Search the database for a source and target node'
        >
          <Filters />
          <SourceNode />
          <SwapButton />
          <RandomButton />
          <TargetNode />
        </CollapsibleSection>
      </Context.Provider>
    );
  }
}
// connect component to global state
NodeSearch = connect((state) => ({
  metagraph: state.metagraph
}))(NodeSearch);
