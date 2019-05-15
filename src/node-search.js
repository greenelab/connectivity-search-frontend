import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { MetanodeChip } from './chips.js';
import { Tooltip } from './tooltip.js';
import { Button } from './buttons.js';
import { searchNodes } from './backend-query.js';
import { lookupNodeById } from './backend-query.js';
import { getRandomNodePair } from './backend-query.js';
import { updateSourceTargetNodes } from './actions.js';
import { swapSourceTargetNodes } from './actions.js';
import { sortCustom } from './util.js';
import './node-search.css';

// node search section component
// target and source node search boxes and swap button
export class NodeSearch extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.filters = [];
    this.state.filterString = '';

    this.updateFilters = this.updateFilters.bind(this);
  }

  // get filter state from filter child component
  updateFilters(filters, filterString) {
    this.setState({ filters: filters, filterString: filterString });
  }

  // display component
  render() {
    return (
      <section className='center'>
        <NodeSearchContext.Provider
          value={{
            filterString: this.state.filterString
          }}
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
        </NodeSearchContext.Provider>
      </section>
    );
  }
}
// allow other components to access component's variables and methods
const NodeSearchContext = React.createContext({});

// filter filter component
// toggle buttons to specify which types of nodes to limit search to
class Filters extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.solo = this.solo.bind(this);
  }

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
  allOn(filters) {
    for (const filter of filters) {
      if (!filter.active)
        return false;
    }

    return true;
  }

  // checks whether all filters besides the specified filter are off
  allOthersOff(filters, type) {
    for (const filter of filters) {
      if (type !== filter.name && filter.active)
        return false;
    }

    return true;
  }

  // toggles the specified filters on/off
  toggle(type) {
    const filters = this.props.filters.slice();

    for (const filter of filters) {
      if (filter.name === type)
        filter.active = !filter.active;
    }

    this.props.updateFilters(filters, this.toString(filters));
  }

  // solo filter (turn all others off)
  solo(type) {
    const filters = this.props.filters.slice();
    const allOthersOff = this.allOthersOff(filters, type);

    for (const filter of filters) {
      if (allOthersOff)
        filter.active = true;
      else {
        if (type === filter.name)
          filter.active = true;
        else
          filter.active = false;
      }
    }

    this.props.updateFilters(filters, this.toString(filters));
  }

  // turn state of filters into string query list of metanode metagraph
  toString(filters) {
    if (this.allOn(filters))
      return '';

    const list = [];
    for (const filter of filters) {
      if (filter.active)
        list.push(this.props.metagraph.kind_to_abbrev[filter.name]);
    }

    return list.join(',');
  }

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

    return <>{buttons}</>;
  }
}
// connect component to global state
Filters = connect((state) => ({
  metagraph: state.metagraph,
  hetioDefinitions: state.hetioDefinitions
}))(Filters);

// filter button component
class FilterButton extends Component {
  // display component
  render() {
    return (
      <Button
        className={
          'node_search_filter_button' +
          (this.props.active ? '' : ' node_search_filter_button_off')
        }
        tooltipText={this.props.tooltipText}
        onClick={() => this.props.toggle(this.props.name)}
        onCtrlClick={() => this.props.solo(this.props.name)}
      >
        <MetanodeChip type={this.props.name} />
        {this.props.name}
      </Button>
    );
  }
}

// source node search box component
class SourceNodeSearch extends Component {
  // initialize component
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }

  // when user makes a new node selection
  onChange(value) {
    this.props.dispatch(updateSourceTargetNodes({ sourceNode: value }));
  }

  // display component
  render() {
    return (
      <SearchBox
        label='Source Node'
        tooltipText='The starting node of the paths'
        value={this.props.node}
        onChange={this.onChange}
      />
    );
  }
}
// connect component to global state
SourceNodeSearch = connect((state) => ({
  node: state.sourceNode
}))(SourceNodeSearch);

// source node search box component
class TargetNodeSearch extends Component {
  // initialize component
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  // when user makes a new node selection
  onChange(value) {
    this.props.dispatch(updateSourceTargetNodes({ targetNode: value }));
    if (value)
      document.activeElement.blur();
  }

  // display component
  render() {
    return (
      <SearchBox
        label='Target Node'
        tooltipText='The ending node of the paths'
        value={this.props.node}
        onChange={this.onChange}
      />
    );
  }
}
// connect component to global state
TargetNodeSearch = connect((state) => ({
  node: state.targetNode
}))(TargetNodeSearch);

// search box component with dropdown autocomplete/autosuggest
class SearchBox extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.state = {};
    this.state.searchResults = [];

    this.inputRef = React.createRef();
    this.formRef = React.createRef();

    this.onInput = this.onInput.bind(this);
  }

  // when user types into or modifies text in text box
  onInput(searchString) {
    searchNodes(searchString, this.context.filterString).then((results) =>
      this.setState({ searchResults: results || [] })
    );
  }

  // convert result/selection item to string to display in text box
  itemToString(item) {
    if (item && item.name)
      return item.name;
    else
      return '';
  }

  // display component
  render() {
    return (
      <Downshift
        onChange={this.props.onChange}
        onInputValueChange={this.onInput}
        itemToString={this.itemToString}
        selectedItem={this.props.value}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          selectedItem,
          highlightedIndex,
          clearSelection
        }) => (
          <div className='node_search_form' ref={this.formRef}>
            <span className='small light node_search_form_label'>
              <Tooltip text={this.props.tooltipText}>
                {this.props.label}
              </Tooltip>
            </span>
            <TextBox
              inputRef={this.inputRef}
              getInputProps={getInputProps}
              clearSelection={clearSelection}
              selectedItem={selectedItem}
            />
            <Dropdown
              isOpen={isOpen}
              inputRef={this.inputRef}
              formRef={this.formRef}
              getMenuProps={getMenuProps}
              searchResults={this.state.searchResults}
              selectedItem={selectedItem}
              highlightedIndex={highlightedIndex}
              getItemProps={getItemProps}
            />
          </div>
        )}
      </Downshift>
    );
  }
}
// connect component to context component
SearchBox.contextType = NodeSearchContext;

// text box sub-component of search box component
class TextBox extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.focused = false;

    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  // when user types into text box
  onInput(event) {
    if (event.target.value === '')
      this.props.clearSelection();
  }

  // when user focuses text box
  onFocus() {
    this.setState({ focused: true });
  }

  // when user unfocuses text box
  onBlur() {
    this.setState({ focused: false });
  }

  // display component
  render() {
    let overlay = <></>;

    const showOverlay =
      !this.state.focused &&
      this.props.selectedItem.metanode &&
      this.props.selectedItem.name;

    if (showOverlay) {
      overlay = (
        <div className='node_search_field_overlay'>
          <MetanodeChip type={this.props.selectedItem.metanode} />
          <span className='node_search_results_item_name nowrap'>
            {this.props.selectedItem.name}
          </span>
        </div>
      );
    }
    return (
      <>
        <TextField
          {...this.props.getInputProps({
            onChange: this.onInput
          })}
          inputRef={this.props.inputRef}
          placeholder='id, name, or metanode'
          classes={{ root: 'node_search_field_container' }}
          InputProps={{
            classes: {
              root: 'node_search_field',
              focused: 'node_search_field_focused',
              input: showOverlay
                ? 'node_search_input_blank'
                : 'node_search_input'
            }
          }}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {overlay}
        <div className='node_search_icon'>
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </>
    );
  }
}

// dropdown sub-component of search box component
class Dropdown extends Component {
  // display component
  render() {
    return (
      <Popper
        open={this.props.isOpen}
        anchorEl={this.props.inputRef.current}
        placement='bottom-start'
        className='node_search_results_popper'
        container={this.props.formRef.current}
        disablePortal={true}
        {...this.props.getMenuProps()}
      >
        <Paper className='node_search_results_paper'>
          {this.props.searchResults.map((result, index) => (
            <MenuItem
              className={
                'node_search_results_item' +
                (this.props.selectedItem.id === result.id
                  ? ' node_search_results_item_selected'
                  : '') +
                (this.props.highlightedIndex === index
                  ? ' node_search_results_item_selected'
                  : '')
              }
              {...this.props.getItemProps({
                item: result,
                key: index
              })}
            >
              <MetanodeChip type={result.metanode} />
              <span className='node_search_results_item_name'>
                {result.name}
              </span>
              <span className='node_search_results_item_identifier'>
                {result.identifier}
              </span>
            </MenuItem>
          ))}
        </Paper>
      </Popper>
    );
  }
}

// swap button component
// switches source/target node
class SwapButton extends Component {
  // initialize component
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  // when user clicks button
  onClick() {
    this.props.dispatch(swapSourceTargetNodes());
  }

  // display component
  render() {
    return (
      <Button
        tooltipText='Swap source and target node'
        className='node_search_swap_button'
        onClick={this.onClick}
      >
        <FontAwesomeIcon icon={faExchangeAlt} />
      </Button>
    );
  }
}
// connect component to global state
SwapButton = connect()(SwapButton);

// random button component
// picks random source/target node with metapaths
class RandomButton extends Component {
  // initialize component
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  // when user clicks button
  onClick() {
    getRandomNodePair()
      .then((results) => {
        return Promise.all([
          lookupNodeById(results.source_id),
          lookupNodeById(results.target_id)
        ]);
      })
      .then(([newSourceNode, newTargetNode]) =>
        this.props.dispatch(
          updateSourceTargetNodes({
            sourceNode: newSourceNode,
            targetNode: newTargetNode
          })
        )
      );
  }

  // display component
  render() {
    return (
      <Button
        tooltipText='Get random source/target node pair that has at least one metapath result'
        className='node_search_swap_button'
        onClick={this.onClick}
      >
        <FontAwesomeIcon icon={faDice} />
      </Button>
    );
  }
}
// connect component to global state
RandomButton = connect()(RandomButton);
