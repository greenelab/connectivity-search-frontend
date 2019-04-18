import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// download metapaths component
// download tabular data as csv
export class DownloadCsv extends Component {
  // initialize component
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  // when user clicks button
  onClick() {
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
    return (
      <button className='link_button small' onClick={this.onClick}>
        .csv <FontAwesomeIcon icon={faDownload} />
      </button>
    );
  }
}
// connect component to global state
DownloadCsv = connect((state) => ({
  metapaths: state.metapaths,
  sourceNode: state.sourceNode,
  targetNode: state.targetNode
}))(DownloadCsv);

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
