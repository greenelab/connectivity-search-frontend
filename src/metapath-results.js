import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';

import { MetanodeChip } from './metanode-chip.js';
import { MetaedgeChip } from './metanode-chip.js';
import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import { CollapsibleSection } from './collapsible-section.js';
import './metapath-results.css';
import './metanode-chip.css';

// helper text when user hovers over given field
const tooltipText = {
  metapath: `The type of path (metapath) connecting the source node to the
    target node`,
  path_count: `The number of paths between the source and target node of the
    specified metapath (path type)`,
  p_value: `A measure of the significance of the DWPC that indicates whether
    more paths were observed than expected due to random chance. Compares the
    DWPC to a null distribution of DWPCs generated from degree-preserving
    permuted networks.`,
  dwpc: `Degree-Weighted Path Count — Measures the extent of connectivity
    between the source and target node for the given metapath. Like the path
    count, but with less weight given to paths along high-degree nodes.`,
  source_degree: `The number of edges from the source node that are of the same
    type as the initial metaedge of the metapath`,
  target_degree: `The number of edges from the target node that are of the same
    type as the final metaedge of the metapath`,
  n_dwpcs: `The number of DWPCs calculated on permuted networks used to
    generate a null distribution for the DWPC from the real network. Permuted
    DWPCs are aggregated for all permuted node pairs with the same degrees as
    the source and target node.`,
  n_nonzero_dwpcs: `The number of permuted DWPCs from "# of DWPCs" column that
    were nonzero. Nonzero DWPCs indicate at least one path between the source
    and target node existed in the permuted network.`,
  nonzero_mean: `The mean of nonzero permuted DWPCs. Used to generate the
    gamma-hurdle model of the null DWPC distribution.`,
  nonzero_sd: `The standard deviation of nonzero permuted DWPCs. Used to
  generate the gamma-hurdle model of the null DWPC distribution.`
};

// path results section component
export class MetapathResults extends Component {
  // display component
  render() {
    return (
      <section>
        <CollapsibleSection
          label='Paths'
          tooltipText='metapath results with p-value <= 0.1'
          className='right'
        >
          {this.props.metapaths.length > 0 ? <TableFull /> : <TableEmpty />}
        </CollapsibleSection>
      </section>
    );
  }
}
// connect component to global state
MetapathResults = connect((state) => ({
  metapaths: state.metapaths
}))(MetapathResults);

// table with results component
class TableFull extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.state = {};
    this.state.showExtraColumns = false;
    this.state.sortColumn = 'p_value';
    this.state.sortUp = false;

    this.toggleShowExtraColumns = this.toggleShowExtraColumns.bind(this);
    this.changeSort = this.changeSort.bind(this);
  }

  // toggle show/hide extra columns
  toggleShowExtraColumns(event) {
    if (event)
      event.preventDefault();

    this.setState({ showExtraColumns: !this.state.showExtraColumns });
  }

  // change which column table is sorted by
  changeSort(sortColumn) {
    const newState = {};
    newState.sortColumn = sortColumn;

    if (sortColumn === this.state.sortColumn)
      newState.sortUp = !this.state.sortUp;
    else
      newState.sortUp = true;

    this.setState(newState);
  }

  // compare numbers (for sorting)
  compareNumbers(a, b, key) {
    // parse as numbers
    const comparison = Number(a[key]) - Number(b[key]);
    if (!Number.isNaN(comparison))
      return comparison;

    // otherwise parse as strings and compare alphabetically
    if (a[key] < b[key])
      return -1;
    else if (a[key] > b[key])
      return 1;
    else
      return 0;
  }

  // compare metapaths (for sorting)
  compareMetapaths(a, b, key) {
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
  }

  // display show more/less button
  showMoreLessButton() {
    return (
      <button
        className='link_button small'
        onClick={this.toggleShowExtraColumns}
      >
        {this.state.showExtraColumns ? 'show less ' : 'show more '}
        <FontAwesomeIcon
          icon={this.state.showExtraColumns ? faAngleLeft : faAngleRight}
        />
      </button>
    );
  }

  // display component
  render() {
    // sort metapaths by specified column
    const metapaths = this.props.metapaths;
    const sortColumn = this.state.sortColumn;

    // sort by appropriate field
    if (sortColumn === 'metaedges')
      metapaths.sort((a, b) => this.compareMetapaths(a, b, sortColumn));
    else
      metapaths.sort((a, b) => this.compareNumbers(a, b, sortColumn));

    // reverse sort direction
    if (this.state.sortUp)
      metapaths.reverse();

    return (
      <TableContext.Provider
        value={{
          showExtraColumns: this.state.showExtraColumns,
          sortColumn: this.state.sortColumn,
          sortUp: this.state.sortUp,
          changeSort: this.changeSort
        }}
      >
        {this.showMoreLessButton()}
        <div
          className='table_container'
          data-expanded={this.context.showExtraColumns}
        >
          <table className='metapath_results_table'>
            <TableHead />
            <TableBody sortedMetapaths={metapaths} />
          </table>
        </div>
      </TableContext.Provider>
    );
  }
}
// allow other components to access component's variables and methods
const TableContext = React.createContext({});
// connect component to global state
TableFull = connect((state) => ({
  sourceNode: state.sourceNode,
  targetNode: state.targetNode,
  metapaths: state.metapaths
}))(TableFull);

// table header component
// contains column labels and sort buttons
class TableHead extends Component {
  // display component
  render() {
    // extra 'super-grouping' row at top of table
    const extraRow = (
      <tr>
        <td className='col_l' />
        <td className='col_s' />
        <td className='col_m' />
        <td className='col_s' />
        <td className='col_xl center' colSpan='6'>
          <div className='divider'>Null DWPC distribution information</div>
        </td>
      </tr>
    );

    // primary columns
    const cols = (
      <>
        <TableHeadCell
          className='col_l left'
          fieldName='metaedges'
          tooltipText={tooltipText['metapath']}
          text='metapath'
        />
        <TableHeadCell
          className='col_s'
          fieldName='path_count'
          tooltipText={tooltipText['path_count']}
          text='path count'
        />
        <TableHeadCell
          className='col_m'
          fieldName='p_value'
          tooltipText={tooltipText['p_value']}
          text={
            <>
              <i>p</i>-value
            </>
          }
        />
      </>
    );

    // extra columns
    const extraCols = (
      <>
        <TableHeadCell
          className='col_s'
          fieldName='dwpc'
          tooltipText={tooltipText['dwpc']}
          text='DWPC'
        />
        <TableHeadCell
          fieldName='source_degree'
          tooltipText={tooltipText['source_degree']}
          text='source degree'
        />
        <TableHeadCell
          fieldName='target_degree'
          tooltipText={tooltipText['target_degree']}
          text='target degree'
        />
        <TableHeadCell
          fieldName='n_dwpcs'
          tooltipText={tooltipText['n_dwpcs']}
          text="# DWPC's"
        />
        <TableHeadCell
          fieldName='n_nonzero_dwpcs'
          tooltipText={tooltipText['n_nonzero_dwpcs']}
          text="# non-0 DWPC's"
        />
        <TableHeadCell
          fieldName='nonzero_mean'
          tooltipText={tooltipText['nonzero_mean']}
          text='non-0 mean'
        />
        <TableHeadCell
          fieldName='nonzero_sd'
          tooltipText={tooltipText['nonzero_sd']}
          text={<>non-0 &sigma;</>}
        />
      </>
    );

    return (
      <thead className='small light_text'>
        {this.context.showExtraColumns && extraRow}
        <tr>
          {cols}
          {this.context.showExtraColumns && extraCols}
        </tr>
      </thead>
    );
  }
}
// connect component to context component
TableHead.contextType = TableContext;

// table header cell component
class TableHeadCell extends Component {
  // display component
  render() {
    return (
      <td className={this.props.className}>
        <SortButton fieldName={this.props.fieldName}>
          <Tooltip text={this.props.tooltipText}>{this.props.text}</Tooltip>
        </SortButton>
      </td>
    );
  }
}

// column sort button component
class SortButton extends Component {
  // display component
  render() {
    return (
      <button
        className='sort_button'
        onClick={() => this.context.changeSort(this.props.fieldName)}
      >
        {this.props.children}
        <FontAwesomeIcon
          icon={
            this.props.fieldName === this.context.sortColumn
              ? this.context.sortUp
                ? faSortUp
                : faSortDown
              : faSort
          }
        />
      </button>
    );
  }
}
// connect component to context component
SortButton.contextType = TableContext;

// table body component
// contains actual data
class TableBody extends Component {
  // display component
  render() {
    return (
      <tbody>
        {this.props.sortedMetapaths.map((node, index) => (
          <TableBodyRow
            key={index}
            node={node}
            showExtraColumns={this.props.showExtraColumns}
          />
        ))}
      </tbody>
    );
  }
}
// connect component to context component
TableBody.contextType = TableContext;

// table body row component
// contains column data for one metapath
class TableBodyRow extends Component {
  // display component
  render() {
    const node = this.props.node;

    // primary columns
    const cols = (
      <>
        <TableBodyCell
          className='left'
          value={metapathChips(node.metaedges)}
          fullValue={node.metapath_name}
        />
        <TableBodyCell value={node.path_count} />
        <TableBodyCell
          className='right'
          style={{ backgroundColor: toGradient(node.p_value) }}
          value={toExponential(node.p_value)}
          fullValue={node.p_value}
        />
      </>
    );

    // extra columns
    const extraCols = (
      <>
        <TableBodyCell value={toFixed(node.dwpc)} fullValue={node.dwpc} />
        <TableBodyCell value={node.source_degree} />
        <TableBodyCell value={node.target_degree} />
        <TableBodyCell value={node.n_dwpcs} />
        <TableBodyCell value={node.n_nonzero_dwpcs} />
        <TableBodyCell
          value={toFixed(node.nonzero_mean)}
          fullValue={node.nonzero_mean}
        />
        <TableBodyCell
          value={toFixed(node.nonzero_sd)}
          fullValue={node.nonzero_sd}
        />
      </>
    );

    return (
      <tr>
        {cols}
        {this.context.showExtraColumns && extraCols}
      </tr>
    );
  }
}
// connect component to context component
TableBodyRow.contextType = TableContext;

// table body cell component
class TableBodyCell extends Component {
  // display component
  render() {
    return (
      <td className={this.props.className} style={this.props.style}>
        <DynamicField
          value={this.props.value}
          fullValue={this.props.fullValue}
        />
      </td>
    );
  }
}

// table with no results component
class TableEmpty extends Component {
  // display component
  render() {
    return (
      <table className='metapath_results_table'>
        <tbody>
          <tr>
            <td className='center light_text'>no results to show</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

// get html of metapath in form of visualization chips
function metapathChips(edges) {
  const path = edges.map((entry, index) => {
    return (
      <React.Fragment key={index}>
        <MetanodeChip type={entry[0]} />
        <MetaedgeChip type={entry[2]} direction={entry[3]} />
        {index === edges.length - 1 && <MetanodeChip type={entry[1]} />}
      </React.Fragment>
    );
  });

  return path;
}

// get html of number in exponential form
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

// get html of number in regular form, rounded to 1 decimal digit
function toFixed(number) {
  number = parseFloat(number).toFixed(1);
  if (!number)
    return <span>NaN</span>;
  return <span>{number}</span>;
}

// map number to css color (rgba or hex) based on specified gradient
function toGradient(number) {
  // pretty gradient
  let gradient = [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 249, 196, 1)',
    'rgba(255, 236, 179, 1)',
    'rgba(255, 224, 178, 1)',
    'rgba(255, 204, 188, 1)',
    'rgba(248, 187, 208, 1)'
  ];

  // split each gradient color into component rgba values
  gradient = gradient.map((color) => {
    color = color.split(/[^0-9,]/).join('');
    color = {
      r: parseInt(color.split(',')[0]),
      g: parseInt(color.split(',')[1]),
      b: parseInt(color.split(',')[2]),
      a: parseFloat(color.split(',')[3])
    };
    return color;
  });

  // take log of number
  // (equivalent of getting exponent of number in exponential notation)
  number = Math.log10(number);

  // start/end cutoffs for exponent
  const rangeStart = -1;
  const rangeEnd = -10;

  // get percent that number is through range
  let percent = (number - rangeStart) / (rangeEnd - rangeStart);
  percent = Math.min(Math.max(0, percent), 1);

  // map percent to float gradient index
  const gradientIndex = (gradient.length - 1) * percent;
  // get integer indices below/above float index
  const lowerColor = gradient[Math.floor(gradientIndex)];
  const higherColor = gradient[Math.ceil(gradientIndex)];
  // get percent that float index is between nearest integer indices
  const percentBetween = gradientIndex % 1;

  // interpolate color between gradient colors below/above float index
  let color = {
    r: lowerColor.r + (higherColor.r - lowerColor.r) * percentBetween,
    g: lowerColor.g + (higherColor.g - lowerColor.g) * percentBetween,
    b: lowerColor.b + (higherColor.b - lowerColor.b) * percentBetween,
    a: lowerColor.a + (higherColor.a - lowerColor.a) * percentBetween
  };

  // clean rgba values
  color.r = Math.floor(color.r);
  color.g = Math.floor(color.g);
  color.b = Math.floor(color.b);
  color.a = color.a.toFixed(3);

  // convert color in rgba format to css color string
  color =
    'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';

  // return color
  return color || '#ffffff';
}
