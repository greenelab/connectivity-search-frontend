import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { Table } from '../components/table.js';
import { metapathChips } from '../components/chips.js';
import { toFixed } from '../util/format';
import { toExponential } from '../util/format.js';
import { toComma } from '../util/format.js';
import { toGradient } from '../util/format.js';
import { cutString } from '../util/string.js';
import { setMetapaths } from './actions.js';

import './metapath-table.css';

// metapath table component
export class MetapathTable extends Component {
  // display component
  render() {
    const onChange = (newData) => {
      this.props.dispatch(
        setMetapaths({ metapaths: newData, updateUrl: true })
      );
    };

    const sortFunctions = [
      null,
      (a, b, key) => {
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
      }
    ];

    let superContents = [];
    let superStyles = [];
    let superClasses = [];
    let superColspans = [];

    if (this.props.showMore) {
      superContents = [
        null,
        null,
        null,
        null,
        null,
        null,
        <div className='line_sides'>Null DWPC distribution information</div>,
        null
      ];
      superStyles = [
        { width: 25 },
        { width: 200 },
        { width: 100 },
        { width: 100 },
        { width: 100 },
        { width: 100 },
        { width: 600 },
        { width: 200 }
      ];
      superClasses = [
        'small',
        'small',
        'small',
        'small',
        'small',
        'small',
        'small',
        'small'
      ];
      superColspans = [1, 1, 1, 1, 1, 1, 6, 1];
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
    let headFields = [
      'checked',
      'metapath_metaedges',
      'path_count',
      'adjusted_p_value'
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
        <a
          href='https://neo4j.het.io/browser/'
          target='_blank'
          rel='noopener noreferrer'
          onClick={(event) => event.stopPropagation()}
        >
          neo4j query
        </a>
      ]);
      headFields = headFields.concat([
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
    }

    const bodyValues = [
      null,
      (datum) => metapathChips(datum.metapath_metaedges),
      (datum) => toComma(datum.path_count),
      (datum) => toExponential(datum.adjusted_p_value),
      (datum) => toExponential(datum.p_value),
      (datum) => toFixed(datum.dwpc),
      (datum) => toComma(datum.dgp_source_degree),
      (datum) => toComma(datum.dgp_target_degree),
      (datum) => toComma(datum.dgp_n_dwpcs),
      (datum) => toComma(datum.dgp_n_nonzero_dwpcs),
      (datum) => toFixed(datum.dgp_nonzero_mean),
      (datum) => toFixed(datum.dgp_nonzero_sd),
      (datum) => cutString(datum.cypher_query, 16)
    ];
    const bodyFullValues = [
      null,
      (datum) => datum.metapath_name,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      (datum) => <textarea rows='4' cols='50' value={datum.cypher_query} />
    ];
    const bodyStyles = [
      null,
      null,
      null,
      (datum) => ({ background: toGradient(datum.adjusted_p_value) }),
      (datum) => ({ background: toGradient(datum.p_value) })
    ];
    const bodyClasses = [null, 'left'];
    const bodyTooltips = [
      (datum) => 'Show these ' + datum.path_count + ' paths in the paths table'
    ];

    return (
      <div className='table_container' data-expanded={this.props.showMore}>
        <Table
          className='metapath_results_table'
          data={this.props.metapaths}
          onChange={onChange}
          sortFunctions={sortFunctions}
          defaultSortField='adjusted_p_value'
          defaultSortUp={false}
          superContents={superContents}
          superStyles={superStyles}
          superClasses={superClasses}
          superColspans={superColspans}
          headContents={headContents}
          headFields={headFields}
          headStyles={headStyles}
          headClasses={headClasses}
          headTooltips={headTooltips}
          bodyValues={bodyValues}
          bodyFullValues={bodyFullValues}
          bodyStyles={bodyStyles}
          bodyClasses={bodyClasses}
          bodyTooltips={bodyTooltips}
        />
      </div>
    );
  }
}
// connect component to global state
MetapathTable = connect((state) => ({
  metapaths: state.metapaths,
  tooltipDefinitions: state.tooltipDefinitions
}))(MetapathTable);
