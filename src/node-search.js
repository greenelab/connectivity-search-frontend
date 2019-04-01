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

import { Metatypes } from './metatypes.js';
import { MetanodeChip } from './metanode-chip.js';
import { searchNodes } from './backend-query.js';
import { updateSourceTargetNodes } from './actions.js';
import { swapSourceTargetNodes } from './actions.js';
import './node-search.css';

// node search section component
// target and source node search boxes and swap button
export class NodeSearch extends Component {
  // display component
  render() {
    return (
      <section className='center'>
        <Filters />
        <SourceNodeSearch />
        <SwapButton />
        <TargetNodeSearch />
      </section>
    );
  }
}

// metatype filter component
// toggle buttons to specify which types of nodes to limit search to
class Filters extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.metatypes = [];
    this.state.filterString = '';

    for (const metatype of Metatypes.nodes)
      this.state.metatypes.push({ name: metatype.name, active: true });
  }

  // checks whether all filters are active
  allOn() {
    for (const metatype of this.state.metatypes) {
      if (!metatype.active)
        return false;
    }
    return true;
  }

  // checks whether all filters besides the specified filter are off
  allOthersOff(type) {
    for (const metatype of this.state.metatypes) {
      if (type !== metatype.name && metatype.active)
        return false;
    }
    return true;
  }

  // toggles the specified filters on/off
  toggle(type) {
    const metatypes = this.state.metatypes;

    for (const metatype of metatypes) {
      if (metatype.name === type)
        metatype.active = !metatype.active;
    }
    this.setState({ metatypes: metatypes }, this.updateString);
  }

  // solo' filter (turn all others off)
  solo(type) {
    const metatypes = this.state.metatypes;
    const allOthersOff = this.allOthersOff(type);

    for (const metatype of metatypes) {
      if (allOthersOff)
        metatype.active = true;
      else {
        if (type === metatype.name)
          metatype.active = true;
        else
          metatype.active = false;
      }
    }

    this.setState({ metatypes: metatypes }, this.updateString);
  }

  // turn state of filters into string query list of metanode abbreviations
  getString() {
    if (this.allOn())
      return '';

    const list = [];
    for (const metatype of this.state.metatypes) {
      if (metatype.active)
        list.push(Metatypes.lookup(metatype.name).abbreviation);
    }

    return list.join(',');
  }

  // pass updated metatype filter string query to parent component
  updateString() {
    this.setState({ filterString: this.getString() });
  }

  // display component
  render() {
    // make list of filter buttons
    const buttons = this.state.metatypes.map((metatype, index) => (
      <button
        key={index}
        className='node_search_filter_button'
        data-active={metatype.active}
        onClick={(event) => {
          if (event.ctrlKey)
            this.solo(metatype.name);
          else
            this.toggle(metatype.name);
        }}
      >
        <MetanodeChip type={metatype.name} />
        {metatype.name}
      </button>
    ));

    return (
      <FiltersContext.Provider
        value={{
          filterString: this.state.string
        }}
      >
        {buttons}
      </FiltersContext.Provider>
    );
  }
}
// allow other components to access component's variables and methods
const FiltersContext = React.createContext({});

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
  }

  // display component
  render() {
    return (
      <SearchBox
        label='Target Node'
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
    if (searchString) {
      searchNodes(searchString, this.context.filterString).then(
        (searchResults) => this.setState({ searchResults: searchResults })
      );
    } else
      this.setState({ searchResults: [] });
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
            <span className='small light_text node_search_form_label'>
              {this.props.label}
            </span>
            <TextBox
              inputRef={this.inputRef}
              getInputProps={getInputProps}
              clearSelection={clearSelection}
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
SearchBox.contextType = FiltersContext;

// text box sub-component of search box component
class TextBox extends Component {
  // initialize component
  constructor() {
    super();

    this.onInput = this.onInput.bind(this);
  }

  // when user types into text box
  onInput(event) {
    if (event.target.value === '')
      this.props.clearSelection();
  }

  // display component
  render() {
    return (
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
            input: 'node_search_input'
          }
        }}
      />
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
      <button className='node_search_swap_button' onClick={this.onClick}>
        <FontAwesomeIcon icon={faExchangeAlt} />
      </button>
    );
  }
}
// connect component to global state
SwapButton = connect()(SwapButton);
