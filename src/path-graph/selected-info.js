import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { sortCustom } from 'hetio-frontend-components';
import { Tooltip } from 'hetio-frontend-components';
import { DynamicField } from 'hetio-frontend-components';

import './selected-info.css';

// selected info component
// shows table of info about selected node or edge in graph
export class SelectedInfo extends Component {
  // get fields of info from selected node/edge
  getFields = () => {
    const element = this.props.hoveredElement || this.props.selectedElement;

    if (!element)
      return [];

    let order = [];
    // get primary fields from top level of node/edge
    let primaryFields = [];
    if (element.elementType === 'node') {
      primaryFields = ['metanode', 'neo4j_id'];
      order = [
        'name',
        'metanode',
        'source',
        'url',
        'description',
        'identifier',
        'neo4j_id'
      ];
    }
    if (element.elementType === 'edge') {
      primaryFields = ['kind', 'directed', 'neo4j_id'];
      order = ['kind', 'neo4j_id', 'source'];
    }

    // get first/second column text (key/value) for each field
    primaryFields = primaryFields.map((field) => ({
      firstCol: field,
      secondCol: String(element[field])
    }));

    // get 'extra fields' from node/edge 'properties' field
    let extraFields = Object.keys(element.properties);
    // get first/second column text (key/value) for each field
    extraFields = extraFields.map((field) => ({
      firstCol: field,
      secondCol: String(element.properties[field])
    }));

    // combine primary and extra fields
    let fields = primaryFields.concat(extraFields);

    // display fields in custom order
    fields = sortCustom(fields, order, 'firstCol');

    return fields;
  };
  // display component
  render() {
    let fields = this.getFields();

    fields = fields.map((field, index) => (
      <React.Fragment key={index}>
        <Tooltip text={this.props.tooltipDefinitions[field.firstCol] || ''}>
          <td className='small light'>{field.firstCol}</td>
        </Tooltip>
        <td>
          <DynamicField value={field.secondCol} className='left small nowrap' />
        </td>
      </React.Fragment>
    ));

    // make rows in groups of two (or one if screen size small)
    const groups = window.innerWidth >= 640 ? 2 : 1;
    const rows = new Array(Math.ceil(fields.length / groups))
      .fill()
      .map(() => fields.splice(0, groups))
      .map((field, index) => <tr key={index}>{field}</tr>);

    let display;
    if (rows.length) {
      display = (
        <table id='graph_info_table'>
          <tbody>{rows}</tbody>
        </table>
      );
    } else {
      display = (
        <div id='graph_info_placeholder' className='center light'>
          Click on or hover over a node or edge
        </div>
      );
    }

    return (
      <div
        id='graph_info_table_container'
        style={{ alignItems: rows.length ? 'flex-start' : 'center' }}
      >
        {display}
      </div>
    );
  }
}
// connect component to global state
SelectedInfo = connect((state) => ({
  tooltipDefinitions: state.tooltipDefinitions
}))(SelectedInfo);
