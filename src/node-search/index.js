import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Context } from './context.js';
import { FilterButton } from './filter-button.js';
// import { SourceNodeSearch } from './source-node-search.js';
// import { TargetNodeSearch } from './target-node-search';
// import { SwapButton } from './swap-button.js';
// import { RandomButton } from './random-button.js';
import { CollapsibleSection } from '../components/collapsible-section.js';
import { sortCustom } from '../util/array.js';
import { compareObjects } from '../util/object.js';

import './index.css';

// node search section component
export class NodeSearch extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.filters = [];
    this.state.filterString = '';
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.filters.length === 0 && this.props.metagraph)
      this.makeFilterList();

    if (!compareObjects(this.state.filters, prevState.filters))
      this.updateFilterString();
  }

  //
  makeFilterList = () => {
    let filters = [];
    for (const filter of this.props.metagraph.metanode_kinds)
      filters.push({ name: filter, active: false });

    // display filters in custom order
    const order = [
      'Gene',
      'Compound',
      'Anatomy',
      'Disease',
      'Symptom',
      'Side Effect',
      'Biological Process',
      'Cellular Component',
      'Molecular Function',
      'Pathway',
      'Pharmacolocic Class'
    ];
    filters = sortCustom(filters, order, 'name');

    this.setState({ filters: filters });
  };

  //
  updateFilterString = () => {
    const list = [];
    for (const filter of this.state.filters) {
      if (filter.active)
        list.push(this.props.metagraph.kind_to_abbrev[filter.name]);
    }

    this.setState({ filterList: list.join(',') });
  };

  // display component
  render() {
    const filterButtons = this.state.filters.map((filter, index) => (
      <FilterButton
        key={index}
        name={filter.name}
        tooltipText={
          this.props.hetioDefinitions
            ? this.props.hetioDefinitions.metanodes[filter.name]
            : ''
        }
        active={filter.active}
        toggle={this.toggle}
        solo={this.solo}
      />
    ));
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
          <div className='small light'>Filters</div>
          <div className='node_search_filters'>{filterButtons}</div>
          {/* <SourceNodeSearch />
          <SwapButton />
          <RandomButton />
          <TargetNodeSearch /> */}
        </CollapsibleSection>
      </Context.Provider>
    );
  }
}
// connect component to global state
NodeSearch = connect((state) => ({
  metagraph: state.app.metagraph,
  hetioDefinitions: state.app.hetioDefinitions
}))(NodeSearch);
