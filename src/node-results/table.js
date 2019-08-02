import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { sortCustom } from 'hetio-frontend-components';
import { shortenUrl } from 'hetio-frontend-components';
import { NodeRow } from './row.js';
import { IconButton } from 'hetio-frontend-components';

// node results table component
// displays details about source/target node
export class NodeTable extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.showMore = false;
  }

  // toggle show/hide extra fields
  toggleShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };

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
          secondCol: (
            <a className='nowrap' href={linkUrl}>
              {linkText}
            </a>
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
    let rows = this.getPrimaryRows();
    if (this.state.showMore)
      rows = rows.concat(this.getExtraRows());

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
    rows = rows.map((row, index) => (
      <NodeRow
        key={index}
        firstCol={row.firstCol}
        secondCol={row.secondCol}
        tooltipText={this.props.tooltipDefinitions[row.firstCol]}
      />
    ));

    return (
      <table className='node_results_table'>
        <thead>
          <tr>
            <th className='small'>{this.props.label}</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <td className='center' colSpan='2'>
              <IconButton
                text={this.state.showMore ? 'show less ' : 'show more '}
                icon={this.state.showMore ? faAngleUp : faAngleDown}
                className='link_button small'
                onClick={this.toggleShowMore}
                tooltipText='Show more information about the node'
              />
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}
// connect component to global state
NodeTable = connect((state) => ({
  tooltipDefinitions: state.tooltipDefinitions
}))(NodeTable);
