// swap button component
// switches source/target node
export class SwapButton extends Component {
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
