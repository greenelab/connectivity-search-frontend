
// random button component
// picks random source/target node with metapaths
export class RandomButton extends Component {
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
