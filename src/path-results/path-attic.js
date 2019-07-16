import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

import { IconButton } from '../components/buttons.js';
import { download } from './download.js';

export class PathAttic extends Component {
  render() {
    const pathCount = this.props.paths.length;
    const pathSelectedCount = this.props.paths.filter((path) => path.checked)
      .length;
    const pathHighlightedCount = this.props.paths.filter(
      (path) => path.highlighted
    ).length;

    return (
      <div className='table_attic'>
        <IconButton
          text='.csv'
          icon={faDownload}
          className='link_button small'
          onClick={() =>
            download(
              this.props.sourceNode,
              this.props.targetNode,
              this.props.paths
            )
          }
          tooltipText='Download table as .csv file'
        />
        <IconButton
          text={this.props.showMore ? 'show less ' : 'show more '}
          icon={this.props.showMore ? faAngleLeft : faAngleRight}
          className='link_button small'
          onClick={this.props.toggleShowMore}
          tooltipText='Expand table and show more columns'
        />
        <div className='small light right'>
          {pathCount} results, {pathSelectedCount} selected,{' '}
          {pathHighlightedCount} highlighted
        </div>
      </div>
    );
  }
}
PathAttic = connect((state) => ({
  sourceNode: state.sourceNode,
  targetNode: state.targetNode,
  paths: state.paths
}))(PathAttic);
