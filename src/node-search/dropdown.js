
// dropdown sub-component of search box component
export class Dropdown extends Component {
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
              {this.props.showMetapathCount && (
                <span className='node_search_results_item_count'>
                  <PathIcon />
                  <span>{result.metapath_count || 0}</span>
                </span>
              )}
            </MenuItem>
          ))}
        </Paper>
      </Popper>
    );
  }
}