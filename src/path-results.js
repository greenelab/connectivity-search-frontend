import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import { Metatypes } from './metatypes.js';
import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import { CollapsibleSection } from './collapsible-section.js';
import './path-results.css';
import { ReactComponent as IconArrowBoth } from './arrow-icon-both.svg';
import { ReactComponent as IconArrowForward } from './arrow-icon-forward.svg';
import { ReactComponent as IconArrowBackward } from './arrow-icon-backward.svg';

const server = 'https://search-api.het.io/v1/querypair/';

function queryResults(sourceId, targetId) {
  const params = new URLSearchParams();
  params.set('source', sourceId);
  params.set('target', targetId);
  const query = server + '?' + params.toString();
  return fetch(query)
    .then((response) => response.json())
    .then((data) => {
      return data.path_counts;
    });
}

export class PathResults extends Component {
  constructor() {
    super();
    this.state = {};
    this.state.results = [];
    this.state.showAllColumns = false;

    this.updateSourceTargetNode = this.updateSourceTargetNode.bind(this);
    this.toggleAllColumns = this.toggleAllColumns.bind(this);
  }
  componentDidMount() {
    this.updateSourceTargetNode();
  }
  componentDidUpdate(prevProps) {
    if (
      (prevProps.sourceNode !== this.props.sourceNode) |
      (prevProps.targetNode !== this.props.targetNode)
    )
      this.updateSourceTargetNode();
  }
  updateSourceTargetNode() {
    if (
      this.props.sourceNode &&
      this.props.sourceNode.id &&
      this.props.targetNode &&
      this.props.targetNode.id
    ) {
      queryResults(this.props.sourceNode.id, this.props.targetNode.id).then(
        (results) => this.setState({ results: results })
      );
    } else
      this.setState({ results: [] });
  }
  toggleAllColumns(event) {
    if (event)
      event.preventDefault();

    this.setState({ showAllColumns: !this.state.showAllColumns });
  }
  tableContent() {
    const tooltipText = {
      metapath:
        'The type of path (metapath) connecting the source node to the target node',
      path_count:
        'The number of paths between the source and target node of the specified metapath (path type)',
      p_value:
        'A measure of the significance of the DWPC that indicates whether more paths were observed than expected due to random chance. Compares the DWPC to a null distribution of DWPCs generated from degree-preserving permuted networks.',
      dwpc:
        'Degree-Weighted Path Count — Measures the extent of connectivity between the source and target node for the given metapath. Like the path count, but with less weight given to paths along high-degree nodes.',
      source_degree:
        'The number of edges from the source node that are of the same type as the initial metaedge of the metapath',
      target_degree:
        'The number of edges from the target node that are of the same type as the final metaedge of the metapath',
      n_dwpcs:
        'The number of DWPCs calculated on permuted networks used to generate a null distribution for the DWPC from the real network. Permuted DWPCs are aggregated for all permuted node pairs with the same degrees as the source and target node.',
      n_nonzero_dwpcs:
        'The number of permuted DWPCs from "# of DWPCs" column that were nonzero. Nonzero DWPCs indicate at least one path between the source and target node existed in the permuted network.',
      nonzero_mean:
        'The mean of nonzero permuted DWPCs. Used to generate the gamma-hurdle model of the null DWPC distribution.',
      nonzero_sd:
        'The standard deviation of nonzero permuted DWPCs. Used to generate the gamma-hurdle model of the null DWPC distribution.'
    };

    const paths = this.state.results.map((entry, index) => (
      <tr key={index}>
        <td className='left'>
          <DynamicField
            value={metapathChips(entry.metaedges)}
            fullValue={entry.metapath_name}
          />
        </td>
        <td>
          <DynamicField value={entry.path_count} />
        </td>
        <td
          className='right'
          style={{ backgroundColor: pValueColorGradient(entry.p_value) }}
        >
          <DynamicField
            value={toExponential(entry.p_value)}
            fullValue={entry.p_value}
          />
        </td>
        <td data-hidden-column={true}>
          <DynamicField value={toFixed(entry.dwpc)} fullValue={entry.dwpc} />
        </td>
        <td data-hidden-column={true}>
          <DynamicField value={entry.source_degree} />
        </td>
        <td data-hidden-column={true}>
          <DynamicField value={entry.target_degree} />
        </td>
        <td data-hidden-column={true}>
          <DynamicField value={entry.n_dwpcs} />
        </td>
        <td data-hidden-column={true}>
          <DynamicField value={entry.n_nonzero_dwpcs} />
        </td>
        <td data-hidden-column={true}>
          <DynamicField
            value={toFixed(entry.nonzero_mean)}
            fullValue={entry.nonzero_mean}
          />
        </td>
        <td data-hidden-column={true}>
          <DynamicField
            value={toFixed(entry.nonzero_sd)}
            fullValue={entry.nonzero_sd}
          />
        </td>
      </tr>
    ));

    return (
      <table
        className='path_results_table'
        data-show-all-columns={this.state.showAllColumns}
      >
        <thead className='small light_text'>
          {this.state.showAllColumns && (
            <tr>
              <td className='col_l' />
              <td className='col_m' />
              <td className='col_m' />
              <td className='col_s' />
              <td className='col_xl center' colSpan='6'>
                <div className='divider'>
                  Null DWPC distribution information
                </div>
              </td>
            </tr>
          )}
          <tr>
            <td className='left'>
              <Tooltip value={tooltipText['metapath']}>Metapath</Tooltip>
            </td>
            <td className='col_m'>
              <Tooltip value={tooltipText['path_count']}>path count</Tooltip>
            </td>
            <td className='col_m'>
              <Tooltip value={tooltipText['p_value']}>
                <i>p</i>-value
              </Tooltip>
            </td>
            <td className='col_s' data-hidden-column={true}>
              <Tooltip value={tooltipText['dwpc']}>DWPC</Tooltip>
            </td>
            <td className='col_s' data-hidden-column={true}>
              <Tooltip value={tooltipText['source_degree']}>
                source degree
              </Tooltip>
            </td>
            <td className='col_s' data-hidden-column={true}>
              <Tooltip value={tooltipText['target_degree']}>
                target degree
              </Tooltip>
            </td>
            <td className='col_m' data-hidden-column={true}>
              <Tooltip value={tooltipText['n_dwpcs']}># DWPC's</Tooltip>
            </td>
            <td className='col_m' data-hidden-column={true}>
              <Tooltip value={tooltipText['n_nonzero_dwpcs']}>
                # non-0 DWPC's
              </Tooltip>
            </td>
            <td className='col_s' data-hidden-column={true}>
              <Tooltip value={tooltipText['nonzero_mean']}>non-0 mean</Tooltip>
            </td>
            <td className='col_s' data-hidden-column={true}>
              <Tooltip value={tooltipText['nonzero_sd']}>non-0 &sigma;</Tooltip>
            </td>
          </tr>
        </thead>
        <tbody>{paths}</tbody>
      </table>
    );
  }
  tableNoContent() {
    return (
      <table className='path_results_table'>
        <tbody>
          <tr>
            <td className='center light_text'>no results to show</td>
          </tr>
        </tbody>
      </table>
    );
  }
  render() {
    const showMoreButton = (
      <a
        tabIndex='0'
        className='small path_results_show_columns_button'
        onClick={this.toggleAllColumns}
        onKeyPress={this.toggleAllColumns}
      >
        {this.state.showAllColumns ? 'show less ' : 'show more '}
        <FontAwesomeIcon
          icon={this.state.showAllColumns ? faAngleLeft : faAngleRight}
        />
      </a>
    );
    return (
      <section>
        <CollapsibleSection label='Paths' className='right'>
          {this.state.results.length > 0 && showMoreButton}
          <div
            className='table_container'
            data-expanded={this.state.showAllColumns}
          >
            {this.state.results.length > 0
              ? this.tableContent()
              : this.tableNoContent()}
          </div>
        </CollapsibleSection>
      </section>
    );
  }
}

function metapathChips(edges) {
  const list = edges.map((entry, index) => {
    let edge;
    switch (entry[3]) {
      case 'backward':
        edge = <IconArrowBackward />;
        break;
      case 'forward':
        edge = <IconArrowForward />;
        break;
      default:
        edge = <IconArrowBoth />;
        break;
    }
    return (
      <span key={index} className='metapath_part'>
        <div className='metanode_chip' data-metatype={entry[0]} />
        <div
          className='metaedge_chip'
          data-metaedge={Metatypes.abbreviations[entry[2]]}
        >
          {edge}
        </div>
        {index === edges.length - 1 && (
          <div className='metanode_chip' data-metatype={entry[1]} />
        )}
      </span>
    );
  });

  return list;
}

function toExponential(number) {
  number = parseFloat(number).toExponential(1);
  const mantissa = parseFloat(number.split('e')[0]).toFixed(1);
  const exponent = parseInt(number.split('e')[1]);
  return (
    <span>
      {mantissa} &times; 10<sup>{exponent}</sup>
    </span>
  );
}

function toFixed(number) {
  number = parseFloat(number).toFixed(1);
  if (!number)
    return <span>NaN</span>;
  return <span>{number}</span>;
}

function pValueColorGradient(pValue) {
  pValue = Math.log10(pValue);

  const rangeStart = -1;
  const rangeEnd = -10;

  let percent = (pValue - rangeStart) / (rangeEnd - rangeStart);
  percent = Math.min(Math.max(0, percent), 1);

  const gradient = [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 249, 196, 1)',
    'rgba(255, 236, 179, 1)',
    'rgba(255, 224, 178, 1)',
    'rgba(255, 204, 188, 1)',
    'rgba(248, 187, 208, 1)'
  ];
  for (let i = 0; i < gradient.length; i++) {
    gradient[i] = gradient[i].split(/[^0-9,]/).join('');
    gradient[i] = {
      r: parseInt(gradient[i].split(',')[0]),
      g: parseInt(gradient[i].split(',')[1]),
      b: parseInt(gradient[i].split(',')[2]),
      a: parseFloat(gradient[i].split(',')[3])
    };
  }

  const gradientIndex = (gradient.length - 1) * percent;
  const lowerColor = gradient[Math.floor(gradientIndex)];
  const higherColor = gradient[Math.ceil(gradientIndex)];
  const percentBetween = gradientIndex % 1;

  let color = {
    r: lowerColor.r + (higherColor.r - lowerColor.r) * percentBetween,
    g: lowerColor.g + (higherColor.g - lowerColor.g) * percentBetween,
    b: lowerColor.b + (higherColor.b - lowerColor.b) * percentBetween,
    a: lowerColor.a + (higherColor.a - lowerColor.a) * percentBetween
  };
  color.r = Math.floor(color.r);
  color.g = Math.floor(color.g);
  color.b = Math.floor(color.b);
  color.a = color.a.toFixed(3);

  color =
    'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';

  return color || '#ffffff';
}
