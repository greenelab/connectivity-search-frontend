import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faHighlighter } from '@fortawesome/free-solid-svg-icons';

import { DynamicField } from 'hetio-frontend-components';
import { Table } from 'hetio-frontend-components';
import { toFixed } from 'hetio-frontend-components';
import { pathChips } from '../components/chips.js';
import { setPaths } from './actions.js';

// path table component
export class PathTable extends Component {
  // display component
  render() {
    const onChange = (newData) => {
      this.props.dispatch(setPaths({ paths: newData, updateUrl: true }));
    };

    const fields = [
      'checked',
      'highlighted',
      'metapath',
      'text_description',
      'score',
      'percent_of_DWPC'
    ];
    const checkboxes = [true, true];
    const sortables = [false, false, true, true, true, true];

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

    const bodyContents = [
      <FontAwesomeIcon className='fa-xs' icon={faEye} />,
      <FontAwesomeIcon className='fa-xs' icon={faHighlighter} />,
      (datum, field, value) => <DynamicField value={value} />,
      (datum, field, value) => (
        <DynamicField
          value={pathChips(datum.assembled || [], this.props.showMore)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField value={toFixed(value)} fullValue={value} />
      ),
      (datum, field, value) => (
        <DynamicField value={toFixed(value)} fullValue={value} />
      )
    ];
    const bodyClasses = [null, null, 'small', 'small left'];
    const bodyTooltips = [
      'Show this path in the graph. Ctrl+click to solo.',
      'Highlight this path in the graph. Ctrl+click to solo.'
    ];

    return (
      <Table
        containerClass={
          this.props.showMore ? 'table_container_expanded' : 'table_container'
        }
        data={this.props.paths}
        fields={fields}
        checkboxes={checkboxes}
        sortables={sortables}
        onChange={onChange}
        defaultSortField='score'
        defaultSortUp={true}
        headContents={headContents}
        headStyles={headStyles}
        headClasses={headClasses}
        headTooltips={headTooltips}
        bodyContents={bodyContents}
        bodyClasses={bodyClasses}
        bodyTooltips={bodyTooltips}
      />
    );
  }
}
// connect component to global state
PathTable = connect((state) => ({
  paths: state.paths,
  tooltipDefinitions: state.tooltipDefinitions
}))(PathTable);
