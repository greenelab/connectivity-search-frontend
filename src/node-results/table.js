import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { sortCustom } from 'hetio-frontend-components';
import { shortenUrl } from 'hetio-frontend-components';
import { InfoTable } from 'hetio-frontend-components';

// node results table component
// displays details about source/target node
export class NodeTable extends Component {
  // get primary row entries
  getPrimaryRows = () => {
    // list of primary rows
    const rows = ['name', 'metanode', 'source'].map((field) => {
      if (field === 'source') {
        const linkUrl =
          this.props.node.url || this.props.node.properties.url || '';
        const linkText = shortenUrl(
          this.props.node.properties.source || linkUrl
        );
        return {
          firstCol: field,
          secondCol: linkUrl ? (
            <a className='nowrap' href={linkUrl}>
              {linkText}
            </a>
          ) : (
            linkText
          )
        };
      } else {
        return {
          firstCol: field,
          secondCol: String(this.props.node[field])
        };
      }
    });
    return rows;
  };

  // get extra row entries
  getExtraRows = () => {
    const rows = Object.keys(this.props.node.properties)
      .filter((field) => field !== 'source' && field !== 'url')
      .map((field) => ({
        firstCol: field,
        secondCol: String(this.props.node.properties[field])
      }))
      .concat(
        {
          firstCol: 'identifier',
          secondCol: String(this.props.node.identifier)
        },
        {
          firstCol: 'id',
          secondCol: String(this.props.node.id)
        }
      );

    return rows;
  };

  // display component
  render() {
    let rows = this.getPrimaryRows().concat(this.getExtraRows());

    // display fields in custom order
    const order = [
      'name',
      'metanode',
      'source',
      'description',
      'identifier',
      'id'
    ];
    rows = sortCustom(rows, order, 'firstCol');

    // make row components from cols
    const bodyContents = rows.map((row, index) => [
      row.firstCol,
      this.props.tooltipDefinitions[row.firstCol],
      row.secondCol
    ]);

    return (
      <InfoTable className='node_results_table' bodyContents={bodyContents} />
    );
  }
}
// connect component to global state
NodeTable = connect((state) => ({
  tooltipDefinitions: state.tooltipDefinitions
}))(NodeTable);
