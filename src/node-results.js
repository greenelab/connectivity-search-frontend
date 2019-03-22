import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import { CollapsibleSection } from './collapsible-section.js';
import './node-results.css';

export class NodeResults extends Component {
  render() {
    return (
      <section>
        <NodeCard label='Source Node' node={this.props.sourceNode} />
        <NodeCard label='Target Node' node={this.props.targetNode} />
      </section>
    );
  }
}

class NodeCard extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.showData = false;

    this.toggleShowData = this.toggleShowData.bind(this);
  }
  toggleShowData() {
    this.setState({ showData: !this.state.showData });
  }
  tableContent() {
    const tooltipText = {
      name: 'The name of the node',
      metanode: 'The type of the node',
      identifier:
        'The indentifier for accessing the node from its particular source',
      source: 'The database from which the node and its properties were gathered',
      description: 'Additional information about the node',
      license:
        'The license governing usage of the information as per its source database',
      class_type: 'The FDA class type of the pharmacologic class',
      chromosome: 'Which chromosome the gene is on',
      inchi: 'The IUPAC International Chemical Identifier (InChI) for the compound',
      inchikey:
        'A condensed representation of the InChI',
        bto_id: 'The BRENDA Tissue Ontology (BTO) identifier for the node',
      mesh_id: 'The Medical Subject Headings (MeSH) identifier for the node'
    };

    const data = this.props.node.data;
    const sortedData = [];
    const keys = Object.keys(data).sort();
    for (const key of keys) {
      if (key === 'url' || key === 'source')
        continue;
      sortedData.push(
        <tr key={key}>
          <td className='col_m small light_text'>
            <Tooltip value={tooltipText[key]}>{key}</Tooltip>
          </td>
          <td>
            <DynamicField value={data[key]} />
          </td>
        </tr>
      );
    }

    return (
      <table className='node_results_table'>
        <tbody>
          <tr>
            <td className='col_m small light_text'>
              <Tooltip value={tooltipText['name']}>name</Tooltip>
            </td>
            <td>
              <DynamicField value={this.props.node.name} />
            </td>
          </tr>
          <tr>
            <td className='col_m small light_text'>
              <Tooltip value={tooltipText['metanode']}>metanode</Tooltip>
            </td>
            <td>
              <DynamicField
                value={
                  <>
                    <div
                      className='metanode_chip'
                      data-metatype={this.props.node.metanode}
                    />
                    {this.props.node.metanode}
                  </>
                }
              />
            </td>
          </tr>
          <tr>
            <td className='col_m small light_text'>
              <Tooltip value={tooltipText['identifier']}>identifier</Tooltip>
            </td>
            <td>
              <DynamicField value={this.props.node.identifier} />
            </td>
          </tr>
          <tr>
            <td className='col_m small light_text'>
              <Tooltip value={tooltipText['source']}>source</Tooltip>
            </td>
            <td>
              <DynamicField
                value={
                  <a href={this.props.node.url}>
                    {this.props.node.data && this.props.node.data.source
                      ? this.props.node.data.source
                      : shortenUrl(this.props.node.url)}
                  </a>
                }
              />
            </td>
          </tr>
          {this.state.showData && sortedData}
          <tr>
            <td className='center' colSpan='2'>
              <a
                tabIndex='0'
                className='col_m small'
                onClick={this.toggleShowData}
                onKeyPress={this.toggleShowData}
              >
                {this.state.showData ? 'show less ' : 'show more '}
                <FontAwesomeIcon
                  icon={this.state.showData ? faAngleUp : faAngleDown}
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
  tableNoContent() {
    return (
      <table className='node_results_table'>
        <tbody>
          <tr>
            <td className='center light_text'>
              select a {this.props.label.toLowerCase()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
  render() {
    return (
      <CollapsibleSection label={this.props.label}>
        {this.props.node.name ? this.tableContent() : this.tableNoContent()}
      </CollapsibleSection>
    );
  }
}

function shortenUrl(url) {
  const remove = ['http://', 'https://', 'www.'];
  for (const str of remove)
    url = url.replace(str, '');

  const cut = 50;
  if (url.length >= cut)
    url = url.substr(0, cut - 3) + '...';

  return url;
}
