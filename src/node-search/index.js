import React from 'react';
import { Component } from 'react';

import { Context } from './context.js';
import { Filters } from './filters.js';
import { SourceNodeSearch } from './source-node-search.js';
import { TargetNodeSearch } from './target-node-search';
import { SwapButton } from './swap-button.js';
import { RandomButton } from './random-button.js';
import { CollapsibleSection } from '../components/collapsible-section.js';

import './styles.css';

// node search section component
export class NodeSearch extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.filters = [];
    this.state.filterString = '';
  }

  // updateFilter string
  updateFilters = (filters, filterString) => {
    this.setState({ filters: filters, filterString: filterString });
  };

  // display component
  render() {
    return (
      <Context.Provider
        value={{
          filterString: this.state.filterString
        }}
      >
        <CollapsibleSection
          label='Node Search'
          tooltipText='Search the database for a source and target node'
        >
          <Filters
            filters={this.state.filters}
            filterString={this.state.filterString}
            updateFilters={this.updateFilters}
          />
          <SourceNodeSearch />
          <SwapButton />
          <RandomButton />
          <TargetNodeSearch />
        </CollapsibleSection>
      </Context.Provider>
    );
  }
}
