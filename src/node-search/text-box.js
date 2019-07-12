
// text box sub-component of search box component
export class TextBox extends Component {
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
  onFocus(event) {
    this.props.onFocus(event.target.value);
    this.props.openMenu();
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
