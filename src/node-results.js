import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { MetanodeChip } from './metanode-chip.js';
import { Tooltip } from './tooltip.js';
import { TextButton } from './buttons.js';
import { DynamicField } from './dynamic-field.js';
import { CollapsibleSection } from './collapsible-section.js';

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
    this.state.showExtraFields = false;

    this.toggleShowExtraFields = this.toggleShowExtraFields.bind(this);
  }

  // toggle show/hide extra fields
  toggleShowExtraFields() {
    this.setState({ showExtraFields: !this.state.showExtraFields });
  }

  // display row entries
  rows() {
    // explicitly specify and order primary fields
    let fields = ['name', 'metanode', 'identifier', 'source'];

    if (this.state.showExtraFields) {
      // get 'extra fields' from node 'data' field
      let extraFields = Object.keys(this.props.node.data);
      // remove unnecessary fields
      extraFields.splice(extraFields.indexOf('source'), 1);
      extraFields.splice(extraFields.indexOf('url'), 1);
      // sort extra fields alphabetically
      extraFields = extraFields.sort();
      // add 'id' to beginning of extra fields
      extraFields.unshift('id');
      // append 'extraFields' to primary 'fields'
      fields = fields.concat(extraFields);
    }

    // determine contents of first and second column for each row entry
    return fields.map((field, index) => {
      // set first col to field name
      const firstCol = field;
      // default second col to field value in node
      let secondCol =
        this.props.node[field] || this.props.node.data[field] || '';

      // handle special field cases
      if (field === 'metanode') {
        // make text with metanode chip
        secondCol = (
          <>
            <MetanodeChip type={this.props.node[field]} />
            <span className='nowrap'>{this.props.node[field]}</span>
          </>
        );
      } else if (field === 'source') {
        // make link
        const linkUrl = this.props.node.url || this.props.node.data.url || '';
        let linkText = this.props.node.data.source || linkUrl;
        linkText = shortenUrl(linkText);
        secondCol = (
          <a className='nowrap' href={linkUrl}>
            {linkText}
          </a>
        );
      }

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

      // return row entry
      return (
        <tr key={index}>
          <td className='col_s small light_text left'>
            <Tooltip text={tooltipText[field]}>{firstCol}</Tooltip>
          </td>
          <td>
            <DynamicField value={secondCol} className='left' />
          </td>
        </tr>
      );
    });
  }

  // display show more/less button
  showMoreLessButton() {
    return (
      <tr>
        <td className='center' colSpan='2'>
          <TextButton
            text={this.state.showExtraFields ? 'show less ' : 'show more '}
            icon={this.state.showExtraFields ? faAngleUp : faAngleDown}
            className='link_button small'
            onClick={this.toggleShowExtraFields}
          />
        </td>
      </tr>
    );
  }

  // display component
  render() {
    return (
      <table className='node_results_table'>
        <tbody>
          {this.rows()}
          {this.showMoreLessButton()}
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
            <td className='center light_text'>
              select a {this.props.label.toLowerCase()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

// remove unnecessary preceding 'www.' and etc from url
function shortenUrl(url) {
  const remove = ['http://', 'https://', 'www.'];
  for (const str of remove)
    url = url.replace(str, '');

  return url;
}
