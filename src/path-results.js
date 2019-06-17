import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import { CollapsibleSection } from './collapsible-section.js';
import { Button } from './buttons.js';
import { DynamicField } from './dynamic-field.js';
import { TextButton } from './buttons.js';
import { EyeCheckbox } from './buttons.js';
import { HighlighterCheckbox } from './buttons.js';
import { downloadCsv } from './util.js';
import { makeFilenameFriendly } from './util.js';
import { pathChips } from './chips.js';
import { updatePathQueries } from './actions.js';
import { toFixed } from './util.js';
import { sortCustom } from './util.js';
import { compareArrays } from './util.js';
import { copyObject } from './util.js';
import './path-results.css';

// path results section component
export class PathResults extends Component {
  // display component
  render() {
    return (
      <CollapsibleSection
        label='Paths'
        tooltipText='Paths of the selected metapaths'
      >
        {this.props.pathQueries.length > 0 ? <TableFull /> : <TableEmpty />}
      </CollapsibleSection>
    );
  }
}
// connect component to global state
PathResults = connect((state) => ({
  pathQueries: state.pathQueries
}))(PathResults);

// table with results component
class TableFull extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.state = {};
    this.state.showMore = false;
    this.state.allChecked = false;
    this.state.allHighlighted = false;
    this.state.sortColumn = 'score';
    this.state.sortUp = true;

    this.toggleShowMore = this.toggleShowMore.bind(this);
    this.toggleAllChecked = this.toggleAllChecked.bind(this);
    this.allChecked = this.allChecked.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.uncheckAll = this.uncheckAll.bind(this);
    this.allOthersUnchecked = this.allOthersUnchecked.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this.soloChecked = this.soloChecked.bind(this);
    this.toggleAllHighlighted = this.toggleAllHighlighted.bind(this);
    this.allHighlighted = this.allHighlighted.bind(this);
    this.highlightAll = this.highlightAll.bind(this);
    this.unhighlightAll = this.unhighlightAll.bind(this);
    this.allOthersUnhighlighted = this.allOthersUnhighlighted.bind(this);
    this.toggleHighlighted = this.toggleHighlighted.bind(this);
    this.soloHighlighted = this.soloHighlighted.bind(this);
    this.changeSort = this.changeSort.bind(this);
    this.downloadCsv = this.downloadCsv.bind(this);
  }

  // when component updates
  componentDidUpdate(prevProps) {
    if (this.props.pathQueries !== prevProps.pathQueries) {
      this.updateAllChecked();
      this.updateAllHighlighted();
    }
  }

  // toggle show more/less
  toggleShowMore(event) {
    if (event)
      event.preventDefault();

    this.setState({ showMore: !this.state.showMore });
  }

  // checks if all rows checked and updates state
  updateAllChecked() {
    if (this.allChecked())
      this.setState({ allChecked: true });
    else
      this.setState({ allChecked: false });
  }

  // toggle check/uncheck all
  toggleAllChecked() {
    if (this.allChecked())
      this.uncheckAll();
    else
      this.checkAll();
  }

  // checks whether all paths are checked
  allChecked() {
    for (const pathQuery of this.props.pathQueries) {
      for (const path of pathQuery.paths) {
        if (!path.checked)
          return false;
      }
    }

    return true;
  }

  // makes all paths checked
  checkAll() {
    const newPathQueries = copyObject(this.props.pathQueries);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths)
        path.checked = true;
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // makes all paths unchecked
  uncheckAll() {
    const newPathQueries = copyObject(this.props.pathQueries);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths)
        path.checked = false;
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // checks whether all paths besides the specified are unchecked
  allOthersUnchecked(thePath) {
    for (const pathQuery of this.props.pathQueries) {
      for (const path of pathQuery.paths) {
        if (!this.comparePaths(path, thePath) && path.checked)
          return false;
      }
    }

    return true;
  }

  // toggles the specified paths on/off
  toggleChecked(thePath) {
    const newPathQueries = copyObject(this.props.pathQueries);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths) {
        if (this.comparePaths(path, thePath))
          path.checked = !path.checked;
      }
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // solo path (turn all others off)
  soloChecked(thePath) {
    const newPathQueries = copyObject(this.props.pathQueries);
    const allOthersUnchecked = this.allOthersUnchecked(thePath);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths) {
        if (allOthersUnchecked || this.comparePaths(path, thePath))
          path.checked = true;
        else
          path.checked = false;
      }
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // checks if all rows highlighted and updates state
  updateAllHighlighted() {
    if (this.allHighlighted())
      this.setState({ allHighlighted: true });
    else
      this.setState({ allHighlighted: false });
  }

  // toggle highlight/unhighlight all
  toggleAllHighlighted() {
    if (this.allHighlighted())
      this.unhighlightAll();
    else
      this.highlightAll();
  }

  // checks whether all paths are highlighted
  allHighlighted() {
    for (const pathQuery of this.props.pathQueries) {
      for (const path of pathQuery.paths) {
        if (!path.highlighted)
          return false;
      }
    }

    return true;
  }

  // makes all paths highlighted
  highlightAll() {
    const newPathQueries = copyObject(this.props.pathQueries);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths)
        path.highlighted = true;
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // makes all paths unhighlighted
  unhighlightAll() {
    const newPathQueries = copyObject(this.props.pathQueries);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths)
        path.highlighted = false;
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // checks whether all paths besides the specified are unhighlighted
  allOthersUnhighlighted(thePath) {
    for (const pathQuery of this.props.pathQueries) {
      for (const path of pathQuery.paths) {
        if (!this.comparePaths(path, thePath) && path.highlighted)
          return false;
      }
    }

    return true;
  }

  // toggles the specified paths on/off
  toggleHighlighted(thePath) {
    const newPathQueries = copyObject(this.props.pathQueries);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths) {
        if (this.comparePaths(path, thePath))
          path.highlighted = !path.highlighted;
      }
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // solo path (turn all others off)
  soloHighlighted(thePath) {
    const newPathQueries = copyObject(this.props.pathQueries);
    const allOthersUnhighlighted = this.allOthersUnhighlighted(thePath);

    for (const pathQuery of newPathQueries) {
      for (const path of pathQuery.paths) {
        if (allOthersUnhighlighted)
          path.highlighted = true;
        else {
          if (this.comparePaths(path, thePath))
            path.highlighted = true;
          else
            path.highlighted = false;
        }
      }
    }

    this.props.dispatch(updatePathQueries({ pathQueries: newPathQueries }));
  }

  // checks if paths are equal
  comparePaths(path1, path2) {
    return (
      compareArrays(path1.node_ids, path2.node_ids) &&
      compareArrays(path1.rel_ids, path2.rel_ids)
    );
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

  // download table data as .csv file
  downloadCsv() {
    if (
      !this.props.pathQueries.length ||
      !this.props.sourceNode.name ||
      !this.props.targetNode.name
    )
      return;

    const tableData = makePathsTable(this.props.pathQueries);
    const filename = [
      'paths',
      makeFilenameFriendly(this.props.sourceNode.name),
      makeFilenameFriendly(this.props.targetNode.name)
    ].join('_');
    downloadCsv(tableData, filename);
  }

  // display component
  render() {
    let nodes = {};
    for (const pathQuery of this.props.pathQueries)
      nodes = { ...nodes, ...pathQuery.nodes };

    let edges = {};
    for (const pathQuery of this.props.pathQueries)
      edges = { ...edges, ...pathQuery.relationships };

    let sortedPaths = [];
    for (const pathQuery of this.props.pathQueries)
      sortedPaths = [...sortedPaths, ...pathQuery.paths];

    // construct full path description/name
    sortedPaths = sortedPaths.map((path) => ({
      ...path,
      chipDescription: pathChips(
        assemblePath(path, nodes, edges),
        this.state.showMore
      ),
      textDescription: textDescription(assemblePath(path, nodes, edges))
    }));

    // sort paths by specified column
    const sortColumn = this.state.sortColumn;

    // sort by appropriate field
    sortedPaths.sort((a, b) => this.compareNumbers(a, b, sortColumn));

    // reverse sort direction
    if (this.state.sortUp)
      sortedPaths.reverse();

    // count paths
    const pathCount = sortedPaths.length;
    let pathSelectedCount = 0;
    for (const path of sortedPaths) {
      if (path.checked)
        pathSelectedCount++;
    }

    let pathHighlightedCount = 0;
    for (const path of sortedPaths) {
      if (path.highlighted)
        pathHighlightedCount++;
    }

    return (
      <TableContext.Provider
        value={{
          sortedPaths: sortedPaths,
          showMore: this.state.showMore,
          allChecked: this.state.allChecked,
          toggleAllChecked: this.toggleAllChecked,
          toggleChecked: this.toggleChecked,
          soloChecked: this.soloChecked,
          allHighlighted: this.state.allHighlighted,
          toggleAllHighlighted: this.toggleAllHighlighted,
          toggleHighlighted: this.toggleHighlighted,
          soloHighlighted: this.soloHighlighted,
          sortColumn: this.state.sortColumn,
          sortUp: this.state.sortUp,
          changeSort: this.changeSort
        }}
      >
        <div className='table_attic'>
          <TextButton
            text='.csv'
            icon={faDownload}
            className='link_button small'
            onClick={this.downloadCsv}
            tooltipText='Download table as .csv file'
          />
          <TextButton
            text={this.state.showMore ? 'show less ' : 'show more '}
            icon={this.state.showMore ? faAngleLeft : faAngleRight}
            className='link_button small'
            onClick={this.toggleShowMore}
            tooltipText='Expand table'
          />
          <div className='small light right'>
            {pathCount} results, {pathSelectedCount} selected,{' '}
            {pathHighlightedCount} highlighted
          </div>
        </div>
        <div className='table_container' data-expanded={this.state.showMore}>
          <table
            className='path_results_table center'
            data-expanded={this.state.showMore}
          >
            <TableHead />
            <TableBody />
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
  metagraph: state.metagraph,
  pathQueries: state.pathQueries
}))(TableFull);

// table header component
// contains column labels and sort buttons
class TableHead extends Component {
  // display component
  render() {
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
        <td className='col_xs'>
          <EyeCheckbox
            checked={this.context.allChecked}
            onClick={() => this.context.toggleAllChecked()}
            onCtrlClick={() => this.context.toggleAllChecked()}
            tooltipText='Show all paths'
          />
        </td>
        <td className='col_xs'>
          <HighlighterCheckbox
            checked={this.context.allHighlighted}
            onClick={() => this.context.toggleAllHighlighted()}
            onCtrlClick={() => this.context.toggleAllHighlighted()}
            tooltipText='Highlight all paths'
          />
        </td>
        <TableHeadCell
          className='col_s left'
          buttonClass='left'
          fieldName='metapath'
          tooltipText={tooltipText['metapath']}
          text='metapath'
        />
        <TableHeadCell
          className='col_xl left'
          buttonClass='left'
          fieldName='textDescription'
          tooltipText={tooltipText['path']}
          text='path'
        />
        <TableHeadCell
          className='col_s'
          fieldName='score'
          tooltipText={tooltipText['score']}
          text='path score'
        />
        <TableHeadCell
          className='col_s'
          fieldName='percent_of_DWPC'
          tooltipText={tooltipText['percent_of_DWPC']}
          text='% of DWPC'
        />
      </>
    );

    return (
      <thead className='small light'>
        <tr>{cols}</tr>
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
        {this.context.sortedPaths.map((path, index) => (
          <TableBodyRow
            key={index}
            path={path}
            checked={path.checked}
            highlighted={path.highlighted}
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
  pathQueries: state.pathQueries
}))(TableBody);

// table body row component
// contains column data for one path
class TableBodyRow extends Component {
  // display component
  render() {
    const path = this.props.path;

    // primary columns
    const cols = (
      <>
        <td>
          <EyeCheckbox
            checked={this.props.checked}
            onClick={() => this.context.toggleChecked(this.props.path)}
            onCtrlClick={() => this.context.soloChecked(this.props.path)}
            tooltipText='Show this path in the graph display'
          />
        </td>
        <td>
          <HighlighterCheckbox
            checked={this.props.highlighted}
            onClick={() => this.context.toggleHighlighted(this.props.path)}
            onCtrlClick={() => this.context.soloHighlighted(this.props.path)}
            tooltipText='Highlight this path in the graph display'
          />
        </td>
        <TableBodyCell
          className='left small'
          fieldClass='left'
          value={path.metapath}
          fullValue={path.metapath}
        />
        <TableBodyCell
          className='left small'
          fieldClass='left'
          value={path.chipDescription}
          fullValue={path.textDescription}
        />
        <TableBodyCell
          value={path.score ? toFixed(path.score) : '-'}
          fullValue={path.score || '-'}
        />
        <TableBodyCell
          value={toFixed(path.percent_of_DWPC)}
          fullValue={path.percent_of_DWPC}
        />
      </>
    );

    return <tr>{cols}</tr>;
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
      <table className='path_results_table'>
        <tbody>
          <tr>
            <td className='center light'>no results to show</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

// construct path object with relevant properties for each node/edge entry
function assemblePath(path, nodes, edges) {
  const pathNodes = [];
  for (const nodeId of path.node_ids) {
    const node = nodes[nodeId];
    if (!node)
      continue;

    pathNodes.push({
      element: 'node',
      type: node.metanode,
      name: node.properties.name
    });
  }

  const pathEdges = [];
  for (let index = 0; index < path.rel_ids.length; index++) {
    const edge = edges[path.rel_ids[index]];
    const prevNode = nodes[path.node_ids[index]];
    if (!edge || !prevNode)
      continue;

    let direction = '';
    if (edge.directed) {
      if (edge.source_neo4j_id === prevNode.neo4j_id)
        direction = 'forward';
      else
        direction = 'backward';
    }

    pathEdges.push({
      element: 'edge',
      type: edge.kind,
      direction: direction
    });
  }

  const assembledPath = [];
  for (const node of pathNodes) {
    assembledPath.push(node);
    if (pathEdges.length > 0)
      assembledPath.push(pathEdges.shift());
  }

  return assembledPath;
}

// produce text path description from assembled path
function textDescription(path) {
  return path.map((entry) => {
    if (entry.element === 'node')
      return entry.name;
    if (entry.element === 'edge') {
      let arrow = '–';
      if (entry.direction === 'forward')
        arrow = '→';
      else if (entry.direction === 'backward')
        arrow = '←';
      return ['', arrow, entry.type, arrow, ''].join(' ');
    }
    return '';
  });
}

// make table array out of path queries results object
function makePathsTable(pathQueries) {
  let nodes = {};
  for (const pathQuery of pathQueries)
    nodes = { ...nodes, ...pathQuery.nodes };

  let edges = {};
  for (const pathQuery of pathQueries)
    edges = { ...edges, ...pathQuery.relationships };

  let paths = [];
  for (const pathQuery of pathQueries)
    paths = [...paths, ...pathQuery.paths];

  for (const path of paths) {
    path.description = textDescription(assemblePath(path, nodes, edges)).join(
      ''
    );
  }

  let headers = [];
  for (const field of Object.keys(paths[0])) {
    if (
      typeof paths[0][field] === 'number' ||
      typeof paths[0][field] === 'string'
    )
      headers.push(field);
  }

  // sort headers in custom order
  const order = [
    'description',
    'metapath',
    'score',
    'percent_of_DWPC'
  ];
  headers = sortCustom(headers, order);

  const table = [];
  table.push(headers);
  for (const result of paths) {
    const row = [];
    for (const header of headers)
      row.push(result[header]);
    table.push(row);
  }

  return table;
}
