import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faHighlighter } from '@fortawesome/free-solid-svg-icons';

import { Table } from '../components/table.js';
import { toFixed } from '../util/format';
import { pathChips } from '../components/chips.js';
import { setPaths } from './actions.js';

// path table component
export class PathTable extends Component {
  // display component
  render() {
    const onChange = (newData) => {
      this.props.dispatch(setPaths({ paths: newData, updateUrl: true }));
    };

    const headContents = [
      <FontAwesomeIcon className='fa-xs' icon={faEye} />,
      <FontAwesomeIcon className='fa-xs' icon={faHighlighter} />,
      'metapath',
      'path',
      <>
        path
        <br />
        score
      </>,
      <>
        % of
        <br />
        DWPC
      </>
    ];
    const headFields = [
      'checked',
      'highlighted',
      'metapath',
      'text_description',
      'score',
      'percent_of_DWPC'
    ];
    const headStyles = [
      { width: 25 },
      { width: 25 },
      { width: 75 },
      { width: 200 },
      { width: 75 },
      { width: 75 }
    ];
    const headClasses = [null, null, 'small', 'small left', 'small', 'small'];
    const headTooltips = [
      'Show/hide all paths',
      'Highlight/unhighlight all paths',
      this.props.tooltipDefinitions['metapath'],
      this.props.tooltipDefinitions['path'],
      this.props.tooltipDefinitions['score'],
      this.props.tooltipDefinitions['percent_of_DWPC']
    ];

    const bodyValues = [
      null,
      null,
      null,
      (datum) => pathChips(datum.assembled || [], this.props.showMore),
      (datum) => toFixed(datum.score),
      (datum) => toFixed(datum.percent_of_DWPC)
    ];
    const bodyFullValues = [
      null,
      null,
      null,
      (datum) => datum.text_description
    ];
    const bodyClasses = [null, null, 'small', 'small left'];
    const bodyTooltips = [
      'Show this path in the graph. Ctrl+click to solo.',
      'Highlight this path in the graph. Ctrl+click to solo.'
    ];

    return (
      <div className='table_container' data-expanded={this.props.showMore}>
        <Table
          className='metapath_results_table'
          data={this.props.paths}
          onChange={onChange}
          defaultSortField='score'
          defaultSortUp={false}
          headContents={headContents}
          headFields={headFields}
          headStyles={headStyles}
          headClasses={headClasses}
          headTooltips={headTooltips}
          bodyValues={bodyValues}
          bodyFullValues={bodyFullValues}
          bodyClasses={bodyClasses}
          bodyTooltips={bodyTooltips}
        />
      </div>
    );
  }
}
// connect component to global state
PathTable = connect((state) => ({
  paths: state.paths,
  tooltipDefinitions: state.tooltipDefinitions
}))(PathTable);
