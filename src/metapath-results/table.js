import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import copy from 'copy-to-clipboard';

import { IconButton } from 'hetio-frontend-components';
import { DynamicField } from 'hetio-frontend-components';
import { Table } from 'hetio-frontend-components';
import { metapathChips } from '../components/chips.js';
import { Tooltip } from 'hetio-frontend-components';
import { toFixed } from 'hetio-frontend-components';
import { toExponential } from 'hetio-frontend-components';
import { toComma } from 'hetio-frontend-components';
import { toGradient } from 'hetio-frontend-components';
import { setMetapaths } from './actions.js';
import { fetchAndSetMetapathMissingData } from './actions.js';

import './table.css';

// metapath table component
export class MetapathTable extends Component {
  // display component
  render() {
    const onChange = (newData) => {
      this.props.dispatch(
        setMetapaths({ metapaths: newData, updateUrl: true })
      );
    };

    const sortFunction = (field) => {
      // sort metapaths
      if (field === 'metapath_metaedges') {
        return (a, b, key) => {
          a = a[key];
          b = b[key];
          // first by length
          if (a.length < b.length)
            return -1;
          else if (a.length > b.length)
            return 1;
          else {
            // then alphabetically
            if (a < b)
              return -1;
            else if (a > b)
              return 1;
            else
              return 0;
          }
        };
      }
    };

    let fields = [
      'checked',
      'metapath_metaedges',
      'path_count',
      'adjusted_p_value'
    ];
    const checkboxes = [true];
    const sortables = [
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ];

    let topContents = [];
    let topStyles = [];
    let topClasses = [];
    let topColspans = [];

    if (this.props.showMore) {
      topContents = [
        null,
        null,
        null,
        null,
        null,
        null,
        <div className='line_sides'>Null DWPC distribution information</div>,
        null
      ];
      topStyles = [
        { width: 25 },
        { width: 200 },
        { width: 100 },
        { width: 100 },
        { width: 100 },
        { width: 100 },
        { width: 600 },
        { width: 200 }
      ];
      topClasses = [
        'small',
        'small',
        'small',
        'small',
        'small',
        'small',
        'small',
        'small'
      ];
      topColspans = [1, 1, 1, 1, 1, 1, 6, 1];
    }

    let headContents = [
      <FontAwesomeIcon className='fa-xs' icon={faCheck} />,
      'metapath',
      <>
        path
        <br />
        count
      </>,
      <span>
        adjusted
        <br />
        <i>p</i>-value
      </span>
    ];
    const headStyles = [
      { width: 25 },
      { width: 200 },
      { width: 100 },
      { width: 100 }
    ];
    const headClasses = [
      null,
      'small left',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small',
      'small'
    ];
    const headTooltips = [
      'Show/hide all metapaths',
      this.props.tooltipDefinitions['metapath'],
      this.props.tooltipDefinitions['path_count'],
      this.props.tooltipDefinitions['adjusted_p_value'],
      this.props.tooltipDefinitions['p_value'],
      this.props.tooltipDefinitions['dwpc'],
      this.props.tooltipDefinitions['dgp_source_degree'],
      this.props.tooltipDefinitions['dgp_target_degree'],
      this.props.tooltipDefinitions['dgp_n_dwpcs'],
      this.props.tooltipDefinitions['dgp_n_nonzero_dwpcs'],
      this.props.tooltipDefinitions['dgp_nonzero_mean'],
      this.props.tooltipDefinitions['dgp_nonzero_sd'],
      this.props.tooltipDefinitions['cypher_query']
    ];

    if (this.props.showMore) {
      fields = fields.concat([
        'p_value',
        'dwpc',
        'dgp_source_degree',
        'dgp_target_degree',
        'dgp_n_dwpcs',
        'dgp_n_nonzero_dwpcs',
        'dgp_nonzero_mean',
        'dgp_nonzero_sd',
        'cypher_query'
      ]);
      headContents = headContents.concat([
        <>
          <i>p</i>-value
        </>,
        'DWPC',
        <>
          source
          <br />
          degree
        </>,
        <>
          target
          <br />
          degree
        </>,
        "# DWPC's",
        <>
          # non-0
          <br />
          DWPC's
        </>,
        <>
          non-0
          <br />
          mean
        </>,
        <>
          non-0
          <br />
          &sigma;
        </>,
        'Neo4j Actions'
      ]);
    }

    const compute = (datum) => (
      <Tooltip
        text='The data for this metapath was not pre-computed because it
          was below a certain threshold of importance. Click to compute it now.'
      >
        <button
          className='small metapath_results_compute'
          onClick={() =>
            this.props.dispatch(
              fetchAndSetMetapathMissingData({
                sourceNodeId: this.props.sourceNode.id,
                targetNodeId: this.props.targetNode.id,
                metapaths: this.props.metapaths,
                metapathId: datum.metapath_id,
                preserveChecks: true
              })
            )
          }
        >
          <FontAwesomeIcon className='fa-sm' icon={faQuestion} />
        </button>
      </Tooltip>
    );
    const bodyContents = [
      <FontAwesomeIcon className='fa-xs' icon={faCheck} />,
      (datum, field, value) => (
        <DynamicField
          value={metapathChips(value)}
          fullValue={datum.metapath_name}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toComma(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toExponential(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toExponential(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toFixed(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toComma(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toComma(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toComma(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toComma(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toFixed(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <DynamicField
          value={value !== undefined ? toFixed(value) : compute(datum)}
          fullValue={value}
        />
      ),
      (datum, field, value) => (
        <>
          <IconButton
            className='small neo4j_button'
            icon={faExternalLinkAlt}
            text='browser'
            href='https://neo4j.het.io/browser/'
            tooltipText={this.props.tooltipDefinitions['neo4j_browser']}
          />
          <IconButton
            className='small neo4j_button clipboard_button'
            icon={faCopy}
            text='command'
            onClick={() => copy(value)}
            flashText='copied'
            flashIcon={faCheck}
            tooltipText={this.props.tooltipDefinitions['neo4j_command']}
          />
        </>
      )
    ];
    const bodyStyles = [
      null,
      null,
      null,
      (datum, field, value) => ({
        background: toGradient(Math.log10(value), [
          [-50, 'rgba(233, 30, 99, 0.5)'],
          [-1, 'rgba(255, 255, 255, 0)']
        ])
      }),
      (datum, field, value) => ({
        background: toGradient(Math.log10(value), [
          [-50, 'rgba(233, 30, 99, 0.5)'],
          [-1, 'rgba(255, 255, 255, 0)']
        ])
      })
    ];
    const bodyClasses = [null, 'left'];
    const bodyTooltips = [
      (datum) =>
        'Show the top 100 of these ' +
        (datum.path_count ? toComma(datum.path_count) : '') +
        ' paths in the paths table. Ctrl+click to solo.'
    ];

    return (
      <Table
        containerClass={
          this.props.showMore ? 'table_container_expanded' : 'table_container'
        }
        className='metapath_results_table'
        data={this.props.metapaths}
        fields={fields}
        checkboxes={checkboxes}
        sortables={sortables}
        onChange={onChange}
        sortFunction={sortFunction}
        defaultSortField='adjusted_p_value'
        defaultSortUp={false}
        dontResort={true}
        topContents={topContents}
        topStyles={topStyles}
        topClasses={topClasses}
        topColspans={topColspans}
        headContents={headContents}
        headStyles={headStyles}
        headClasses={headClasses}
        headTooltips={headTooltips}
        bodyContents={bodyContents}
        bodyStyles={bodyStyles}
        bodyClasses={bodyClasses}
        bodyTooltips={bodyTooltips}
      />
    );
  }
}
// connect component to global state
MetapathTable = connect((state) => ({
  sourceNode: state.sourceNode,
  targetNode: state.targetNode,
  metapaths: state.metapaths,
  tooltipDefinitions: state.tooltipDefinitions
}))(MetapathTable);
