import React from 'react';
import { Component } from 'react';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

import { Metatypes } from './metatypes.js';
import './node-search.css';

const server = 'https://search-api.het.io/v1/nodes/';

function queryNodes(searchString, metatypes) {
  const params = new URLSearchParams();
  params.set('search', searchString);
  params.set('limit', '100');
  if (metatypes)
    params.set('metanodes', metatypes);
  const query = server + '?' + params.toString();
  return fetch(query)
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    });
}

export class NodeSearch extends Component {
  render() {
    return (
      <section>
        <SearchBox
          updateSourceTargetNode={this.props.updateSourceTargetNode}
          label='Source Node'
          node='source'
          value={this.props.sourceNode}
          metatypeFilters={this.props.metatypeFilters}
        />
        <button
          onClick={this.props.swapSourceTargetNodes}
          className='node_search_swap_button'
        >
          <FontAwesomeIcon icon={faExchangeAlt} />
        </button>
        <SearchBox
          updateSourceTargetNode={this.props.updateSourceTargetNode}
          label='Target Node'
          node='target'
          value={this.props.targetNode}
          metatypeFilters={this.props.metatypeFilters}
        />
      </section>
    );
  }
}

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.results = [];
    this.inputRef = React.createRef();
    this.formRef = React.createRef();

    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleInput(searchString) {
    const metatypeFilters = this.props.metatypeFilters;
    const list = [];
    let allOn = true;
    for (const metatype in metatypeFilters) {
      if (metatypeFilters[metatype])
        list.push(Metatypes.abbreviations[metatype]);
      else
        allOn = false;
    }
    let metatypes;
    if (!allOn)
      metatypes = list.join(',');

    if (searchString) {
      queryNodes(searchString, metatypes).then((results) =>
        this.setState({ results: results })
      );
    } else
      this.setState({ results: [] });
  }
  handleChange(value) {
    const newState = {};
    if (this.props.node === 'source')
      newState.sourceNode = value;
    else if (this.props.node === 'target')
      newState.targetNode = value;
    this.props.updateSourceTargetNode(newState);
  }
  itemToString(item) {
    if (item && item.name)
      return item.name;
    else
      return '';
  }
  render() {
    return (
      <Downshift
        onChange={this.handleChange}
        onInputValueChange={this.handleInput}
        itemToString={this.itemToString}
        selectedItem={this.props.value}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          selectedItem,
          highlightedIndex
        }) => (
          <div className='node_search_form' ref={this.formRef}>
            <span className='small light_text node_search_form_label'>
              {this.props.label}
            </span>
            <TextField
              {...getInputProps()}
              inputRef={this.inputRef}
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
            <Popper
              open={isOpen}
              anchorEl={this.inputRef.current}
              placement='bottom-start'
              className='node_search_results_popper'
              container={this.formRef.current}
              disablePortal={true}
              {...getMenuProps()}
            >
              <Paper className='node_search_results_paper'>
                {this.state.results.map((result, index) => (
                  <MenuItem
                    className={
                      'node_search_results_item' +
                      (selectedItem.id === result.id
                        ? ' node_search_results_item_selected'
                        : '') +
                      (highlightedIndex === index
                        ? ' node_search_results_item_selected'
                        : '')
                    }
                    {...getItemProps({
                      item: result,
                      key: index
                    })}
                  >
                    <div
                      className='metanode_chip'
                      data-metatype={result.metanode}
                    />
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
          </div>
        )}
      </Downshift>
    );
  }
}
