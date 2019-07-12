import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { Table } from './table.js';
import { metapathChips } from './chips.js';
import { toFixed } from './util.js';
import { toExponential } from './util.js';
import { toComma } from './util.js';
import { toGradient } from './util.js';
import { cutString } from './util.js';

export class Test extends Component {
  render() {
    return (
      <Table
        data={this.props.metapaths}
        defaultSortField='adjusted_p_value'
        defaultSortUp={false}
        superContents={[
          '',
          '',
          '',
          '',
          '',
          '',
          <div className='line_sides'>Null DWPC distribution information</div>,
          ''
        ]}
        superWidths={[30, 200, 100, 100, 100, 100, 600, 200]}
        superAligns={[]}
        superColspans={[1, 1, 1, 1, 1, 1, 6, 1]}
        superTooltips={[
          '',
          '',
          '',
          '',
          '',
          '',
          'Null DWPC distribution information',
          ''
        ]}
        headContents={[
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
          </>,
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
          <>non-0<br/>mean</>,
          <>non-0<br/>&sigma;</>,
          <a
            href='https://neo4j.het.io/browser/'
            target='_blank'
            rel='noopener noreferrer'
            onClick={(event) => event.stopPropagation()}
          >
            neo4j query
          </a>
        ]}
        headFields={[
          'checked',
          'metapath_metaedges',
          'path_count',
          'adjusted_p_value',
          'p_value',
          'dwpc',
          'dgp_source_degree',
          'dgp_target_degree',
          'dgp_n_dwpcs',
          'dgp_n_nonzero_dwpcs',
          'dgp_nonzero_mean',
          'dgp_nonzero_sd',
          'cypher_query'
        ]}
        headWidths={[]}
        headAligns={['', 'left']}
        headTooltips={[
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text'
        ]}
        bodyValues={[
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
        ]}
        bodyFullValues={[
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
        ]}
        bodyColors={[
          null,
          null,
          null,
          (datum) => toGradient(datum.adjusted_p_value),
          (datum) => toGradient(datum.p_value)
        ]}
        bodyTooltips={[
          (datum) =>
            'Show these ' + datum.path_count + ' paths in the paths table'
        ]}
      />
    );
  }
}
Test = connect((state) => ({
  metapaths: state.metapaths
}))(Test);
