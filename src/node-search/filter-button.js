
// filter button component
export class FilterButton extends Component {
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