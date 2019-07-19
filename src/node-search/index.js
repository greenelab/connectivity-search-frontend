import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Context } from './context.js';
import { FilterButton } from './filter-button.js';
import { SourceNode } from './source-node.js';
import { TargetNode } from './target-node.js';
import { SwapButton } from './swap-button.js';
import { RandomButton } from './random-button.js';
import { CollapsibleSection } from '../components/collapsible-section.js';
import { Tooltip } from '../components/tooltip.js';
import { sortCustom } from '../util/array.js';
import { compareObjects } from '../util/object.js';
import { copyObject } from '../util/object.js';

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

  // when component updates
  componentDidUpdate(prevProps, prevState) {
    if (this.state.filters.length === 0 && this.props.metagraph.metanode_kinds)
      this.makeFilterList();

    if (!compareObjects(this.state.filters, prevState.filters))
      this.updateFilterString();
  }

  // make filter list based on metagraph metanode types
  makeFilterList = () => {
    let filters = [];
    for (const filter of this.props.metagraph.metanode_kinds)
      filters.push({ name: filter, active: true });

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

  // assemble and update filter string for search query
  updateFilterString = () => {
    const list = [];
    for (const filter of this.state.filters) {
      if (filter.active)
        list.push(this.props.metagraph.kind_to_abbrev[filter.name]);
    }

    this.setState({ filterString: list.join(',') });
  };

  // toggle the specified filter on/off
  toggle = (name) => {
    const newFilters = copyObject(this.state.filters);

    for (const filter of newFilters) {
      if (filter.name === name)
        filter.active = !filter.active;
    }

    this.setState({ filters: newFilters });
  };

  // solo filter (turn all others off)
  solo = (name) => {
    let allOthersOff = true;

    for (const filter of this.state.filters) {
      if (filter.name !== name && filter.active) {
        allOthersOff = false;
        break;
      }
    }

    const newFilters = copyObject(this.state.filters);

    for (const filter of newFilters) {
      if (allOthersOff)
        filter.active = true;
      else {
        if (filter.name === name)
          filter.active = true;
        else
          filter.active = false;
      }
    }

    this.setState({ filters: newFilters });
  };

  // display component
  render() {
    const filterButtons = this.state.filters.map((filter, index) => (
      <FilterButton
        key={index}
        name={filter.name}
        tooltipText={this.props.tooltipDefinitions[filter.name]}
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
          <Tooltip text='Filter the text search by metatype. Ctrl+click to solo.'>
            <div className='small light node_search_filter_label'>Filters</div>
          </Tooltip>
          <div className='node_search_filters'>{filterButtons}</div>
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
  metagraph: state.metagraph,
  tooltipDefinitions: state.tooltipDefinitions
}))(NodeSearch);
