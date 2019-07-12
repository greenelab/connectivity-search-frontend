// search box component with dropdown autocomplete/autosuggest
export class SearchBox extends Component {
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
    let otherNodeId = '';
    if (this.props.otherNode && this.props.otherNode.id !== undefined)
      otherNodeId = this.props.otherNode.id;

    // if one node selected and other node search box focused but empty,
    // show list of nodes in order of metapath count
    if (searchString === '' && otherNodeId !== '') {
      searchNodesMetapaths(otherNodeId).then((results) =>
        this.setState({ searchResults: results || [] })
      );
    } else {
      // otherwise, show normal search results based on search string
      searchNodes(searchString, this.context.filterString, otherNodeId).then(
        (results) => this.setState({ searchResults: results || [] })
      );
    }
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
        onBlur={this.onBlur}
        onInputValueChange={this.onInput}
        itemToString={this.itemToString}
        selectedItem={this.props.node}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          selectedItem,
          highlightedIndex,
          clearSelection,
          openMenu
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
              onFocus={this.onInput}
              openMenu={openMenu}
            />
            <Dropdown
              isOpen={isOpen}
              inputRef={this.inputRef}
              formRef={this.formRef}
              getMenuProps={getMenuProps}
              searchResults={this.state.searchResults}
              showMetapathCount={this.props.otherNode.id !== undefined}
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
