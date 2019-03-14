import React, { Component } from "react";
import Downshift from "downshift";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SwapIcon from "@material-ui/icons/Cached";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

import { MetaTypes } from "./metatypes";

const server = "http://34.236.226.254/api/v1/nodes/?search=";

function queryNodes(query) {
  return fetch(server + query)
    .then(response => response.json())
    .then(data => {
      return data.results;
    });
}

export class Search extends Component {
  render() {
    return (
      <section>
        <SearchBox label="Start Node" />
        <SwapButton />
        <SearchBox label="End Node" />
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
  }
  handleInput = query => {
    if (query)
      queryNodes(query).then(results => this.setState({ results: results }));
    else this.setState({ results: [] });
  };
  handleChange = value => {
    console.log("change", value);
  };
  itemToString = item => {
    if (item) return item.name + " | " + item.identifier;
    else return "";
  };
  componentDidUpdate() {}
  componentDidMount() {}
  render() {
    return (
      <Downshift
        isOpen={true}
        onChange={this.handleChange}
        onInputValueChange={this.handleInput}
        itemToString={this.itemToString}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => (
          <div className="search_form" ref={this.formRef}>
            <label {...getLabelProps()} className="search_label">
              {this.props.label}
            </label>
            <TextField
              {...getInputProps()}
              inputRef={this.inputRef}
              placeholder="id, name, or metanode"
              classes={{ root: "search_field_container" }}
              InputProps={{
                classes: {
                  root: "search_field",
                  focused: "search_field_focused",
                  input: "search_input"
                }
              }}
            />
            <Popper
              open={true}
              anchorEl={this.inputRef.current}
              placement="bottom-start"
              className="search_results_popper"
              container={this.formRef.current}
              disablePortal={true}
            >
              <div {...getMenuProps()}>
                <Paper className="search_results_paper">
                  {this.state.results.map((result, index) => (
                    <MenuItem
                      className="search_results_item"
                      {...getItemProps({ item: result, key: index })}
                    >
                      <span
                        className="search_results_item_metanode metanode_chip"
                        data-metanode={result.metanode}
                      >
                        {MetaTypes.initial(result.metanode)}
                      </span>
                      <span className="search_results_item_name">
                        {result.name}
                      </span>
                      <span className="search_results_item_identifier">
                        {result.identifier}
                      </span>
                    </MenuItem>
                  ))}
                </Paper>
              </div>
            </Popper>
          </div>
        )}
      </Downshift>
    );
  }
}

class SwapButton extends Component {
  render() {
    return (
      <IconButton className="swap_button">
        <SwapIcon />
      </IconButton>
    );
  }
}
