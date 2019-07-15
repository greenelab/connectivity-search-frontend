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

import './metapath-table.css';

export class MetapathTable extends Component {
  // display component
  render() {
    let superContents = [];
    let superWidths = [];
    let superAligns = [];
    let superColspans = [];

    if (this.props.showMore) {
      superContents = [
        '',
        '',
        '',
        '',
        '',
        '',
        <div className='line_sides'>Null DWPC distribution information</div>,
        ''
      ];
      superWidths = [25, 200, 100, 100, 100, 100, 600, 200];
      superAligns = [];
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
      <>
        adjusted
        <br />
        <i>p</i>-value
      </>
    ];
    let headFields = [
      'checked',
      'metapath_metaedges',
      'path_count',
      'adjusted_p_value'
    ];
    const headWidths = [25, 200, 100, 100];
    const headAligns = ['', 'left'];
    const headTooltips = [
      'Show/hide all paths',
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

    const compareFunction = (field) => {
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
      } else
        return null;
    };
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
    const bodyColors = [
      null,
      null,
      null,
      (datum) => toGradient(datum.adjusted_p_value),
      (datum) => toGradient(datum.p_value)
    ];
    const bodyTooltips = [
      (datum) => 'Show these ' + datum.path_count + ' paths in the paths table'
    ];

    return (
      <div className='table_container' data-expanded={this.props.showMore}>
        <Table
          className='metapath_results_table'
          data={this.props.metapaths}
          defaultSortField='adjusted_p_value'
          defaultSortUp={false}
          superContents={superContents}
          superWidths={superWidths}
          superAligns={superAligns}
          superColspans={superColspans}
          headContents={headContents}
          headFields={headFields}
          headWidths={headWidths}
          headAligns={headAligns}
          headTooltips={headTooltips}
          compareFunction={compareFunction}
          bodyValues={bodyValues}
          bodyFullValues={bodyFullValues}
          bodyColors={bodyColors}
          bodyTooltips={bodyTooltips}
        />
      </div>
    );
  }
}
MetapathTable = connect((state) => ({
  metapaths: state.metapaths,
  tooltipDefinitions: state.tooltipDefinitions
}))(MetapathTable);
