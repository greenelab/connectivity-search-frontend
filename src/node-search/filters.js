import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { FilterButton } from './filter-button.js';

// filter filter component
// toggle buttons to specify which types of nodes to limit search to
export class Filters extends Component {
  componentDidUpdate(prevProps) {
    if (
      prevProps.metagraph.metanode_kinds === this.props.metagraph.metanode_kinds
    )
      return;

    // initialize filters
    let filters = [];
    const filterString = '';

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

    this.props.updateFilters(filters, filterString);
  }

  // checks whether all filters are active
  allOn = (filters) => {
    for (const filter of filters) {
      if (!filter.active)
        return false;
    }

    return true;
  };

  // checks whether all filters besides the specified filter are off
  allOthersOff = (filters, type) => {
    for (const filter of filters) {
      if (type !== filter.name && filter.active)
        return false;
    }

    return true;
  };

  // toggles the specified filters on/off
  toggle = (type) => {
    const newFilters = copyObject(this.props.filters);

    for (const filter of newFilters) {
      if (filter.name === type)
        filter.active = !filter.active;
    }

    this.props.updateFilters(newFilters, this.toString(newFilters));
  };

  // solo filter (turn all others off)
  solo = (type) => {
    const newFilters = copyObject(this.props.filters);
    const allOthersOff = this.allOthersOff(newFilters, type);

    for (const filter of newFilters) {
      if (allOthersOff)
        filter.active = true;
      else {
        if (type === filter.name)
          filter.active = true;
        else
          filter.active = false;
      }
    }

    this.props.updateFilters(newFilters, this.toString(newFilters));
  };

  // turn state of filters into string query list of metanode metagraph
  toString = (filters) => {
    if (this.allOn(filters))
      return '';

    const list = [];
    for (const filter of filters) {
      if (filter.active)
        list.push(this.props.metagraph.kind_to_abbrev[filter.name]);
    }

    return list.join(',');
  };

  // display component
  render() {
    // make list of filter buttons
    const buttons = this.props.filters.map((filter, index) => (
      <FilterButton
        key={index}
        name={filter.name}
        tooltipText={this.props.hetioDefinitions.metanodes[filter.name]}
        active={filter.active}
        toggle={this.toggle}
        solo={this.solo}
      />
    ));

    return (
      <>
        <div className='small light'>Filters</div>
        <div className='node_search_filters'>{buttons}</div>
      </>
    );
  }
}
// connect component to global state
Filters = connect((state) => ({
  metagraph: state.metagraph,
  hetioDefinitions: state.hetioDefinitions
}))(Filters);
