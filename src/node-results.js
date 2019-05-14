import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { MetanodeChip } from './chips.js';
import { Tooltip } from './tooltip.js';
import { TextButton } from './buttons.js';
import { DynamicField } from './dynamic-field.js';
import { CollapsibleSection } from './collapsible-section.js';
import { shortenUrl } from './util.js';
import { sortCustom } from './util.js';

// node results section component
// details about source/target nodes
export class NodeResults extends Component {
  // display component
  render() {
    return (
      <section>
        <NodeCard label='Source Node' node={this.props.sourceNode} />
        <NodeCard label='Target Node' node={this.props.targetNode} />
      </section>
    );
  }
}
// connect component to global state
NodeResults = connect((state) => ({
  sourceNode: state.sourceNode,
  targetNode: state.targetNode
}))(NodeResults);

// node 'card' component
// displays details about source/target node
class NodeCard extends Component {
  // display component
  render() {
    return (
      <CollapsibleSection
        label={this.props.label}
        tooltipText={'Details about the ' + this.props.label.toLowerCase()}
      >
        {this.props.node.name ? (
          <TableFull node={this.props.node} />
        ) : (
          <TableEmpty label={this.props.label} />
        )}
      </CollapsibleSection>
    );
  }
}

// table with results component
class TableFull extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.showMore = false;

    this.toggleShowMore = this.toggleShowMore.bind(this);
  }

  // toggle show/hide extra fields
  toggleShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }

  // display row entries
  rows() {
    // helper text when user hovers over given field
    let tooltipText = {};
    if (this.props.hetioDefinitions.properties) {
      tooltipText = {
        ...tooltipText,
        ...this.props.hetioDefinitions.properties.common,
        ...this.props.hetioDefinitions.properties.nodes
      };
    }
    tooltipText = { ...tooltipText, ...this.props.hetmechDefinitions };

    // get primary fields from top level of node
    let primaryFields = ['name', 'metanode', 'source', 'identifier', 'id'];
    // get first/second column text (key/value) for each field
    primaryFields = primaryFields.map((field) => {
      // handle special field cases
      let specialSecondCol;
      if (field === 'metanode') {
        // make text with metanode chip
        specialSecondCol = (
          <>
            <MetanodeChip type={this.props.node[field]} />
            <span className='nowrap'>{this.props.node[field]}</span>
          </>
        );
      } else if (field === 'source') {
        // make link
        const linkUrl = this.props.node.url || this.props.node.properties.url || '';
        let linkText = this.props.node.properties.source || linkUrl;
        linkText = shortenUrl(linkText);
        specialSecondCol = (
          <a className='nowrap' href={linkUrl}>
            {linkText}
          </a>
        );
      }
      // get first/second column text (key/value) for each field
      return {
        firstCol: field,
        secondCol: specialSecondCol || String(this.props.node[field]),
        tooltipText: tooltipText[field]
      };
    });
    // remove id and identifier if table not expanded
    if (!this.state.showMore) {
      primaryFields.splice(
        primaryFields.findIndex((field) => field.firstCol === 'id'),
        1
      );
      primaryFields.splice(
        primaryFields.findIndex((field) => field.firstCol === 'identifier'),
        1
      );
    }

    // get 'extra fields' from node 'properties' field
    let extraFields = [];
    if (this.state.showMore) {
      extraFields = Object.keys(this.props.node.properties);
      // remove source and url, since they are combined and added to
      // primary fields above
      extraFields.splice(extraFields.indexOf('source'), 1);
      extraFields.splice(extraFields.indexOf('url'), 1);
      // get first/second column text (key/value) for each field
      extraFields = extraFields.map((field) => ({
        firstCol: field,
        secondCol: String(this.props.node.properties[field]),
        tooltipText: tooltipText[field]
      }));
    }

    // combine primary and extra fields
    let fields = primaryFields.concat(extraFields);

    // display fields in custom order
    const order = [
      'name',
      'metanode',
      'source',
      'description',
      'identifier',
      'id'
    ];
    fields = sortCustom(fields, order, 'firstCol');

    // make rows from fields
    return fields.map((field, index) => {
      return (
        <tr key={index}>
          <td className='col_s small light'>
            <Tooltip text={field.tooltipText}>{field.firstCol}</Tooltip>
          </td>
          <td>
            <DynamicField value={field.secondCol} className='left' />
          </td>
        </tr>
      );
    });
  }

  // display component
  render() {
    return (
      <table className='node_results_table'>
        <tbody>
          {this.rows()}
          <tr>
            <td className='center' colSpan='2'>
              <TextButton
                text={this.state.showMore ? 'show less ' : 'show more '}
                icon={this.state.showMore ? faAngleUp : faAngleDown}
                className='link_button small'
                onClick={this.toggleShowMore}
                tooltipText='Show more information about the node'
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
// connect component to global state
TableFull = connect((state) => ({
  hetioDefinitions: state.hetioDefinitions,
  hetmechDefinitions: state.hetmechDefinitions
}))(TableFull);

// table with no results component
class TableEmpty extends Component {
  render() {
    return (
      <table className='node_results_table'>
        <tbody>
          <tr>
            <td className='center light'>
              select a {this.props.label.toLowerCase()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
