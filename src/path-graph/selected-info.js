import React from 'react';
import { Component } from 'react';

import { sortCustom } from '../util/array.js';
import { Tooltip } from '../components/tooltip.js';

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
    const fields = this.getFields();

    const rows = fields.map((field, index) => (
      <tr key={index}>
        <Tooltip text={field.firstCol}>
          <td className='small light'>{field.firstCol}</td>
        </Tooltip>
        <td className='small'>{field.secondCol}</td>
      </tr>
    ));
    return (
      <table id='graph_info_table'>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className='light'>Click on or hover over a node or edge</td>
            </tr>
          )}
          {rows}
        </tbody>
      </table>
    );
  }
}
