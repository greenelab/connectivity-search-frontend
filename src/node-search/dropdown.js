import React from 'react';
import { Component } from 'react';

import { MetanodeChip } from '../components/chips.js';
import { ReactComponent as PathIcon } from '../images/path.svg';

import './dropdown.css';

// dropdown sub-component of search box component
export class Dropdown extends Component {
  // display component
  render() {
    return (
      <div className='node_search_menu' {...this.props.getMenuProps()}>
        {this.props.isOpen &&
          this.props.searchResults.map((result, index) => (
            <div
              className={
                'node_search_item' +
                (this.props.selectedItem.id === result.id ||
                this.props.highlightedIndex === index
                  ? ' node_search_item_selected'
                  : '')
              }
              {...this.props.getItemProps({
                item: result,
                key: index
              })}
            >
              <MetanodeChip type={result.metanode} />
              <span className='node_search_name nowrap'>{result.name}</span>
              {this.props.showMetapathCount && (
                <span className='node_search_count'>
                  <PathIcon />
                  <span>{result.metapath_count || 0}</span>
                </span>
              )}
            </div>
          ))}
      </div>
    );
  }
}
