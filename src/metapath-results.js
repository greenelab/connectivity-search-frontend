import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';

import { MetanodeChip } from './metanode-chip.js';
import { MetaedgeChip } from './metanode-chip.js';
import { Button } from './buttons.js';
import { TextButton } from './buttons.js';
import { DynamicField } from './dynamic-field.js';
import { CollapsibleSection } from './collapsible-section.js';
import './metapath-results.css';
import './metanode-chip.css';

// path results section component
export class MetapathResults extends Component {
  // display component
  render() {
    return (
      <section>
        <CollapsibleSection
          label='Metapaths'
          tooltipText='Metapath results with p-value <= 0.1'
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
    this.downloadCsv = this.downloadCsv.bind(this);
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

  downloadCsv() {
    if (
      !this.props.metapaths.length ||
      !this.props.sourceNode.name ||
      !this.props.targetNode.name
    )
      return;

    const tableData = makeMetapathsTable(this.props.metapaths);
    const filename = [
      'metapaths',
      makeFilenameFriendly(this.props.sourceNode.name),
      makeFilenameFriendly(this.props.targetNode.name)
    ].join('_');
    downloadCsv(tableData, filename);
  }

  // display component
  render() {
    // sort metapaths by specified column
    const sortedMetapaths = this.props.metapaths;
    const sortColumn = this.state.sortColumn;

    // sort by appropriate field
    if (sortColumn === 'metaedges')
      sortedMetapaths.sort((a, b) => this.compareMetapaths(a, b, sortColumn));
    else
      sortedMetapaths.sort((a, b) => this.compareNumbers(a, b, sortColumn));

    // reverse sort direction
    if (this.state.sortUp)
      sortedMetapaths.reverse();

    return (
      <TableContext.Provider
        value={{
          showExtraColumns: this.state.showExtraColumns,
          sortColumn: this.state.sortColumn,
          sortUp: this.state.sortUp,
          changeSort: this.changeSort
        }}
      >
        <TextButton
          text='.csv'
          icon={faDownload}
          className='link_button small'
          onClick={this.downloadCsv}
        />
        <TextButton
          text={this.state.showExtraColumns ? 'show less ' : 'show more '}
          icon={this.state.showExtraColumns ? faAngleLeft : faAngleRight}
          className='link_button small'
          onClick={this.toggleShowExtraColumns}
        />
        <div
          className='table_container'
          data-expanded={this.state.showExtraColumns}
        >
          <table className='metapath_results_table'>
            <TableHead />
            <TableBody sortedMetapaths={sortedMetapaths} />
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
        <td className='col_xs' />
        <td className='col_l' />
        <td className='col_s' />
        <td className='col_m' />
        <td className='col_s' />
        <td className='col_xl center' colSpan='6'>
          <div className='divider'>Null DWPC distribution information</div>
        </td>
      </tr>
    );

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

    // primary columns
    const cols = (
      <>
        <TableHeadCell
          className='col_l left'
          buttonClass='left'
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
// connect component to global state
TableHead = connect((state) => ({
  hetioDefinitions: state.hetioDefinitions,
  hetmechDefinitions: state.hetmechDefinitions
}))(TableHead);

// table header cell component
class TableHeadCell extends Component {
  // display component
  render() {
    return (
      <td className={this.props.className}>
        <SortButton
          text={this.props.text}
          tooltipText={this.props.tooltipText}
          fieldName={this.props.fieldName}
          className={this.props.buttonClass}
        />
      </td>
    );
  }
}

// column sort button component
class SortButton extends Component {
  // display component
  render() {
    return (
      <Button
        tooltipText={this.props.tooltipText}
        className={'sort_button ' + (this.props.className || '')}
        onClick={() => this.context.changeSort(this.props.fieldName)}
      >
        {this.props.text}
        <FontAwesomeIcon
          icon={
            this.props.fieldName === this.context.sortColumn
              ? this.context.sortUp
                ? faSortUp
                : faSortDown
              : faSort
          }
        />
      </Button>
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
        {this.props.sortedMetapaths.map((metapath, index) => (
          <TableBodyRow
            key={index}
            metapath={metapath}
            checked={metapath.checked}
            showExtraColumns={this.props.showExtraColumns}
          />
        ))}
      </tbody>
    );
  }
}
// connect component to context component
TableBody.contextType = TableContext;
// connect component to global state
TableBody = connect((state) => ({
  metapaths: state.metapaths
}))(TableBody);

// table body row component
// contains column data for one metapath
class TableBodyRow extends Component {
  // display component
  render() {
    const metapath = this.props.metapath;

    // primary columns
    const cols = (
      <>
        <TableBodyCell
          className='left'
          fieldClass='left'
          value={metapathChips(metapath.metaedges)}
          fullValue={metapath.metapath_name}
        />
        <TableBodyCell value={metapath.path_count} />
        <TableBodyCell
          className='right'
          style={{ backgroundColor: toGradient(metapath.p_value) }}
          value={toExponential(metapath.p_value)}
          fullValue={metapath.p_value}
        />
      </>
    );

    // extra columns
    const extraCols = (
      <>
        <TableBodyCell
          value={toFixed(metapath.dwpc)}
          fullValue={metapath.dwpc}
        />
        <TableBodyCell value={metapath.source_degree} />
        <TableBodyCell value={metapath.target_degree} />
        <TableBodyCell value={metapath.n_dwpcs} />
        <TableBodyCell value={metapath.n_nonzero_dwpcs} />
        <TableBodyCell
          value={toFixed(metapath.nonzero_mean)}
          fullValue={metapath.nonzero_mean}
        />
        <TableBodyCell
          value={toFixed(metapath.nonzero_sd)}
          fullValue={metapath.nonzero_sd}
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
          className={this.props.fieldClass}
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

// make table array out of metapaths results object
function makeMetapathsTable(metapaths) {
  let headers = [];
  for (const field of Object.keys(metapaths[0])) {
    if (
      typeof metapaths[0][field] === 'number' ||
      typeof metapaths[0][field] === 'string'
    )
      headers.push(field);
  }

  // sort headers in custom order
  const order = {
    id: 1,
    metapath_name: 2,
    metapath_abbreviation: 3,
    path_count: 4,
    p_value: 5,
    dwpc: 6,
    source_degree: 7,
    target_degree: 8,
    n_dwpcs: 9,
    n_nonzero_dwpcs: 10,
    nonzero_mean: 11,
    nonzero_sd: 12
  };
  headers = headers.sort((a, b) => {
    if (order[a] && order[b])
      return order[a] - order[b];
    else if (order[a])
      return -1;
    else if (order[b])
      return 1;
    else
      return b - a;
  });

  const table = [];
  table.push(headers);
  for (const result of metapaths) {
    const row = [];
    for (const header of headers)
      row.push(result[header]);
    table.push(row);
  }

  return table;
}

// downloads provided data as csv file
// data in format [ [A1, B1] , [A2, B2] ]
function downloadCsv(data, filename) {
  const fileContent = data.map((cell) => cell.join(',')).join('\n');
  const blob = new Blob([fileContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = url;
  link.download = (filename || 'data') + '.csv';
  link.click();
  window.URL.revokeObjectURL(url);
  link.remove();
}

// make OS-friendly filename
function makeFilenameFriendly(string) {
  // remove leading and trailing whitespace
  string = string.trim();
  // replace special characters with dashes
  string = string.replace(/[^0-9A-Za-z]/gi, '-');
  // shorten if too long
  string = string.substring(0, 15);
  return string;
}
