import React from 'react';
import { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { MetanodeChip } from '../components/chips.js';

import './text-box.css';

// text box sub-component of search box component
export class TextBox extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.focused = false;
  }

  // when user types into text box
  onInput = (event) => {
    if (event.target.value === '')
      this.props.clearSelection();
  };

  // when user focuses text box
  onFocus = (event) => {
    this.props.onFocus(event.target.value);
    this.props.openMenu();
    this.setState({ focused: true });
  };

  // when user unfocuses text box
  onBlur = () => {
    this.setState({ focused: false });
  };

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
          placeholder='name or identifier'
          classes={{ root: 'node_search_field_container' }}
          InputProps={{
            classes: {
              root: 'node_search_field',
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
