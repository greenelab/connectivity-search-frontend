import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faListOl } from '@fortawesome/free-solid-svg-icons';

import { ReactComponent as SortUp } from '../images/sort-up.svg';
import { ReactComponent as SortDown } from '../images/sort-down.svg';

import { Button } from './buttons.js';
import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import { compareObjects } from '../util/object.js';
import { copyObject } from '../util/object.js';

import './table.css';

const rowIndexKey = '_rowIndex';
const cellHighlightKey = '_cellHighlight';

// generic table component
// contains three sections: top (row above head), head, and body
// contents, styles, and classes can be specified for all sections
// tooltips can be specified for head and body
// colspans can be specified for top
// custom sort function can be specified
// supports img or font-awesome checkboxes
// checkboxes get the attribute data-checked to allow desired CSS styling
// sort arrows get the attribute data-disabled to allow desired CSS styling
export class Table extends Component {
  // initialize component
  constructor(props) {
    super(props);

    // ref to table container
    this.ref = React.createRef();

    this.state = {};
    this.state.hovered = false;

    // input data at different stages in processing chain
    this.state.indexedData = [];
    this.state.sortedData = [];
    this.state.filteredData = [];
    this.state.paginatedData = [];
    // final data passed to children for render
    this.state.data = [];
    // table control vars
    this.state.sortField = this.props.defaultSortField || '';
    this.state.sortUp = this.props.defaultSortUp || false;
    this.state.searchString = '';
    this.state.searchResults = 0;
    this.state.page = 1;
    this.state.pages = 1;
    this.state.perPage = 10;
    this.state.dragField = null;
    this.state.dragValue = null;
    this.state.dragList = [];

    // end checkbox drag when mouse released anywhere
    window.addEventListener('mouseup', this.endDrag);
    window.addEventListener('keydown', this.onKeyDown);
  }

  // when component mounts
  componentDidMount() {
    const newState = {};

    newState.indexedData = this.indexData(this.props.data);
    newState.sortedData = this.sortData(newState.indexedData);
    newState.filteredData = this.filterData(newState.sortedData);
    newState.searchResults = newState.filteredData.length || 0;
    newState.paginatedData = this.paginateData(newState.filteredData);
    newState.pages = this.calcPages(newState.filteredData, this.state.perPage);
    newState.data = newState.paginatedData;

    this.setState(newState);
  }

  // when component updates
  componentDidUpdate(prevProps, prevState) {
    const newState = {};

    // when input data changes
    if (
      !compareObjects(this.props.data, prevProps.data) ||
      !compareObjects(this.props.headFields, prevProps.headFields)
    ) {
      newState.indexedData = this.indexData(this.props.data);
      // if number of input data rows hasn't changed, assume none were added,
      // deleted, or reordered, and preserve previous sorting
      // assumes prevState.indexedData and newState.indexedData in same order
      if (this.props.data.length === prevProps.data.length) {
        newState.sortedData = this.preserveSortData(
          prevState.sortedData,
          newState.indexedData
        );
      } else
        newState.sortedData = this.sortData(newState.indexedData);
      newState.filteredData = this.filterData(newState.sortedData);
      newState.searchResults = newState.filteredData.length || 0;
      newState.paginatedData = this.paginateData(newState.filteredData);
      newState.pages = this.calcPages(
        newState.filteredData,
        this.state.perPage
      );
      newState.data = newState.paginatedData;
    }

    // when sort column or direction changes
    if (
      this.state.sortField !== prevState.sortField ||
      this.state.sortUp !== prevState.sortUp
    ) {
      newState.sortedData = this.sortData(this.state.indexedData);
      newState.filteredData = this.filterData(newState.sortedData);
      newState.paginatedData = this.paginateData(newState.filteredData);
      newState.data = newState.paginatedData;
    }

    // when search string changes
    if (this.state.searchString !== prevState.searchString) {
      newState.filteredData = this.filterData(this.state.sortedData);
      newState.searchResults = newState.filteredData.length || 0;
      newState.paginatedData = this.paginateData(newState.filteredData);
      newState.pages = this.calcPages(
        newState.filteredData,
        this.state.perPage
      );
      newState.page = 1;
      newState.data = newState.paginatedData;
    }

    // when page controls change
    if (
      this.state.page !== prevState.page ||
      this.state.perPage !== prevState.perPage
    ) {
      newState.paginatedData = this.paginateData(this.state.filteredData);
      newState.pages = this.calcPages(
        this.state.filteredData,
        this.state.perPage
      );
      newState.data = newState.paginatedData;
    }

    // set new state, if any
    if (Object.keys(newState).length > 0)
      this.setState(newState);
  }

  // set hovered state
  setHovered = (hovered) => {
    this.setState({ hovered: hovered });
  };

  // when user presses key
  onKeyDown = (event) => {
    if (!this.ref.current)
      return;

    if (!this.state.hovered)
      return;

    // if user is hovering over table, let arrow keys control pagination nav
    if (event.key === 'ArrowLeft') {
      if (event.ctrlKey)
        this.setPage(1);
      else
        this.setPage(this.state.page - 1);
    }

    if (event.key === 'ArrowRight') {
      if (event.ctrlKey)
        this.setPage(this.state.pages);
      else
        this.setPage(this.state.page + 1);
    }
  };

  // //////////////////////////////////////////////////
  // DATA FUNCTIONS
  // //////////////////////////////////////////////////

  // call input onChange function with new data to set
  setData = (data) => {
    if (!this.props.onChange)
      return;

    data = copyObject(data);

    // remove row index property from each object
    for (const datum of data)
      delete datum[rowIndexKey];

    this.props.onChange(data);
  };

  // attach row index property to data for easy referencing/identification
  indexData = (data) => {
    data = copyObject(data);

    let index = 0;
    for (const datum of data) {
      datum[rowIndexKey] = index;
      index++;
    }

    return data;
  };

  // sort table data based on sort field and direction
  sortData = (data) => {
    data = copyObject(data);

    // get sort function from props or standard/default sort
    let func;
    if (this.props.sortFunction)
      func = this.props.sortFunction(this.state.sortField);
    if (typeof func !== 'function')
      func = this.defaultSort;

    // sort
    data.sort((a, b) => func(a, b, this.state.sortField, this.state.sortUp));

    // reverse sort direction
    if (this.state.sortUp)
      data.reverse();

    return data;
  };

  // compare function for sorting
  defaultSort = (a, b, key, sortUp) => {
    // if both are numbers, compare by values
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      if (a[key] < b[key])
        return -1;
      else if (a[key] > b[key])
        return 1;
      else
        return 0;
    }

    // if one is undefined/object and the other is not, always put the
    // undefined/object vertically below
    if (
      (typeof a[key] === 'undefined' || typeof a[key] === 'object') &&
      !(typeof b[key] === 'undefined' || typeof b[key] === 'object')
    )
      return sortUp ? -1 : 1;
    if (
      !(typeof a[key] === 'undefined' || typeof a[key] === 'object') &&
      (typeof b[key] === 'undefined' || typeof b[key] === 'object')
    )
      return sortUp ? 1 : -1;

    // otherwise, compare alphabetically
    if (a[key] < b[key])
      return -1;
    else if (a[key] > b[key])
      return 1;
    else
      return 0;
  };

  // sort data in same order as it was before, based on index
  preserveSortData = (oldData, newData) => {
    oldData = copyObject(oldData);
    newData = copyObject(newData);

    let returnData = [];
    for (const oldDatum of oldData) {
      const index = newData.findIndex(
        (newDatum) => oldDatum[rowIndexKey] === newDatum[rowIndexKey]
      );
      if (index !== -1) {
        returnData.push(newData[index]);
        newData.splice(index, 1);
      }
    }

    returnData = [...returnData, ...newData];

    return returnData;
  };

  // filter table based on search textbox
  filterData = (data) => {
    data = copyObject(data);

    if (!this.state.searchString)
      return data;

    return data.filter((datum) => {
      for (const field of this.props.headFields) {
        if (
          datum[field] !== undefined &&
          datum[field] !== null &&
          JSON.stringify(datum[field])
            .toLowerCase()
            .includes(this.state.searchString.toLowerCase())
        ) {
          datum[cellHighlightKey] = field;
          return true;
        }
      }
      return false;
    });
  };

  // paginate data based on page controls
  paginateData = (data) => {
    data = copyObject(data);

    const start = (this.state.page - 1) * this.state.perPage;
    const end = start + this.state.perPage;

    return data.slice(start, end);
  };

  // //////////////////////////////////////////////////
  // CHECKBOX FUNCTIONS
  // //////////////////////////////////////////////////

  // toggles checkbox on/off
  toggleChecked = (rowIndex, field) => {
    const newData = copyObject(this.state.indexedData);

    for (const row of newData) {
      if (row[rowIndexKey] === rowIndex)
        row[field] = !row[field];
    }

    this.setData(newData);
  };

  // solo checkbox (turn all others off)
  soloChecked = (rowIndex, field) => {
    const newData = copyObject(this.state.indexedData);

    let allOthersUnchecked = true;
    for (const row of newData) {
      if (row[rowIndexKey] !== rowIndex && row[field]) {
        allOthersUnchecked = false;
        break;
      }
    }

    for (const row of newData) {
      if (allOthersUnchecked || row[rowIndexKey] === rowIndex)
        row[field] = true;
      else
        row[field] = false;
    }

    this.setData(newData);
  };

  // checks whether all checkboxes are checked
  allChecked = (field) => {
    for (const datum of this.props.data) {
      if (!datum[field])
        return false;
    }

    return true;
  };

  // checks whether all checkboxes are unchecked
  allUnchecked = (field) => {
    for (const datum of this.props.data) {
      if (datum[field])
        return false;
    }

    return true;
  };

  // check or uncheck all checkboxes
  toggleAll = (field) => {
    const newData = copyObject(this.props.data);

    const newChecked = this.allUnchecked(field);
    for (const datum of newData)
      datum[field] = newChecked;

    this.setData(newData);
  };

  // begin dragging checkboxes
  beginDrag = (field, newChecked) => {
    this.setState({ dragField: field, dragValue: newChecked });
  };

  // add row index to drag list
  addToDragList = (rowIndex) => {
    if (!this.state.dragList.includes(rowIndex))
      this.setState({ dragList: [...this.state.dragList, rowIndex] });
  };

  // end dragging checkboxes
  endDrag = () => {
    if (
      !this.state.dragField ||
      typeof this.state.dragValue !== 'boolean' ||
      !this.state.dragList.length
    ) {
      this.resetDrag();
      return;
    }

    const newData = copyObject(this.state.indexedData);

    for (const datum of newData) {
      if (this.state.dragList.includes(datum[rowIndexKey]))
        datum[this.state.dragField] = this.state.dragValue;
    }

    this.setData(newData);
    this.resetDrag();
  };

  // cancel dragging checkboxes
  resetDrag = () => {
    this.setState({ dragField: null, dragValue: null, dragList: [] });
  };

  // //////////////////////////////////////////////////
  // SORT FUNCTIONS
  // //////////////////////////////////////////////////

  // change which field table is sorted by
  changeSort = (field) => {
    const newState = {};
    newState.sortField = field;

    if (field === this.state.sortField)
      newState.sortUp = !this.state.sortUp;
    else
      newState.sortUp = true;

    this.setState(newState);
  };

  // //////////////////////////////////////////////////
  // SEARCH/FILTER FUNCTIONS
  // //////////////////////////////////////////////////

  // when user types into searchbox
  onSearch = (value) => {
    this.setState({ searchString: value });
  };

  // //////////////////////////////////////////////////
  // PAGE FUNCTIONS
  // //////////////////////////////////////////////////

  // set page number
  setPage = (page) => {
    if (typeof page !== 'number')
      page = 1;
    page = Math.round(page);
    if (page < 1)
      page = 1;
    if (page > this.state.pages)
      page = this.state.pages;

    this.setState({ page: page });
  };

  // set per page
  setPerPage = (value) => {
    value = Number(value);
    if (Number.isNaN(value))
      value = 10;

    this.setState({ perPage: value, page: 1 });
  };

  // calculate number of pages based on results and per page
  calcPages = (data, perPage) => {
    return Math.ceil(data.length / perPage);
  };

  // display component
  render() {
    return (
      <TableContext.Provider
        value={{
          setHovered: this.setHovered,
          data: this.state.data,
          // checkbox props
          dragField: this.state.dragField,
          dragValue: this.state.dragValue,
          // checkbox functions
          toggleChecked: this.toggleChecked,
          soloChecked: this.soloChecked,
          allChecked: this.allChecked,
          toggleAll: this.toggleAll,
          beginDrag: this.beginDrag,
          addToDragList: this.addToDragList,
          resetDrag: this.resetDrag,
          // sort props
          sortField: this.state.sortField,
          sortUp: this.state.sortUp,
          // sort functions
          changeSort: this.changeSort,
          // search props
          searchString: this.state.searchString,
          searchResults: this.state.searchResults,
          // search/filter functions
          onSearch: this.onSearch,
          // page props
          page: this.state.page,
          pages: this.state.pages,
          perPage: this.state.perPage,
          // page functions
          setPage: this.setPage,
          setPerPage: this.setPerPage,
          // table input
          topContents: this.props.topContents || [],
          topStyles: this.props.topStyles || [],
          topClasses: this.props.topClasses || [],
          topColspans: this.props.topColspans || [],
          headContents: this.props.headContents || [],
          headFields: this.props.headFields || [],
          headStyles: this.props.headStyles || [],
          headClasses: this.props.headClasses || [],
          headTooltips: this.props.headTooltips || [],
          bodyValues: this.props.bodyValues || [],
          bodyFullValues: this.props.bodyFullValues || [],
          bodyStyles: this.props.bodyStyles || [],
          bodyClasses: this.props.bodyClasses || [],
          bodyTooltips: this.props.bodyTooltips || []
        }}
      >
        <div
          className={this.props.containerClass}
          ref={this.ref}
          onMouseEnter={() => this.setHovered(true)}
          onMouseLeave={() => this.setHovered(false)}
        >
          <table className={this.props.className}>
            <thead>
              <Top />
              <Head />
            </thead>
            <tbody>
              <Body />
            </tbody>
          </table>
        </div>
        <Controls />
      </TableContext.Provider>
    );
  }
}
const TableContext = React.createContext({});

// top section
// row above head row
class Top extends Component {
  // display component
  render() {
    const cells = this.context.topContents.map((content, index) => (
      <TopCell
        key={index}
        content={content}
        style={this.context.topStyles[index]}
        className={this.context.topClasses[index]}
        colspan={this.context.topColspans[index]}
      />
    ));

    if (cells.length > 0)
      return <tr>{cells}</tr>;
    else
      return <></>;
  }
}
Top.contextType = TableContext;

// top cell
class TopCell extends Component {
  // display component
  render() {
    return (
      <th
        style={this.props.style || {}}
        className={this.props.className || ''}
        colSpan={this.props.colspan || 1}
      >
        {this.props.content}
      </th>
    );
  }
}
TopCell.contextType = TableContext;

// head section
// contains sort buttons and field names
class Head extends Component {
  // display component
  render() {
    const cells = this.context.headContents.map((content, index) => {
      if (typeof content.type === 'function') {
        return (
          <HeadCheckboxCell
            key={index}
            content={content}
            field={this.context.headFields[index]}
            style={this.context.headStyles[index]}
            className={this.context.headClasses[index]}
            tooltip={this.context.headTooltips[index]}
          />
        );
      } else {
        return (
          <HeadCell
            key={index}
            content={content}
            field={this.context.headFields[index]}
            style={this.context.headStyles[index]}
            className={this.context.headClasses[index]}
            tooltip={this.context.headTooltips[index]}
          />
        );
      }
    });

    if (cells.length > 0)
      return <tr>{cells}</tr>;
    else
      return <></>;
  }
}
Head.contextType = TableContext;

// head checkbox cell
// contains specified checkbox
class HeadCheckboxCell extends Component {
  // display component
  render() {
    return (
      <Tooltip text={this.props.tooltip || ''}>
        <th
          style={this.props.style || {}}
          className={this.props.className || ''}
        >
          <Button
            className='table_button'
            onClick={() => this.context.toggleAll(this.props.field)}
          >
            <span data-checked={this.context.allChecked(this.props.field)}>
              {this.props.content}
            </span>
          </Button>
        </th>
      </Tooltip>
    );
  }
}
HeadCheckboxCell.contextType = TableContext;

// head cell
// contains sort button
class HeadCell extends Component {
  // display component
  render() {
    const sortIconProps = {
      'className': 'table_sort_icon',
      'data-disabled': this.props.field !== this.context.sortField
    };

    return (
      <Tooltip text={this.props.tooltip || ''}>
        <th
          style={this.props.style || {}}
          className={this.props.className || ''}
        >
          <Button
            className='table_button'
            onClick={() => this.context.changeSort(this.props.field)}
          >
            {this.props.content}
            {this.props.field === this.context.sortField ? (
              this.context.sortUp ? (
                <SortUp {...sortIconProps} />
              ) : (
                <SortDown {...sortIconProps} />
              )
            ) : (
              <SortUp {...sortIconProps} />
            )}
          </Button>
        </th>
      </Tooltip>
    );
  }
}
HeadCell.contextType = TableContext;

// body section
// contains actual data
class Body extends Component {
  // display component
  render() {
    const rows = this.context.data.map((datum, index) => (
      <BodyRow key={index} datum={datum} />
    ));
    return <>{rows}</>;
  }
}
Body.contextType = TableContext;

// one row in body
// represents one datum of provided data
class BodyRow extends Component {
  // display component
  render() {
    const cells = this.context.headFields.map((field, index) => {
      if (typeof this.context.headContents[index].type === 'function') {
        return (
          <BodyCheckboxCell
            key={index}
            datum={this.props.datum}
            field={field}
            content={this.context.headContents[index]}
            checked={this.props.datum[field] ? true : false}
            style={this.context.bodyStyles[index]}
            className={this.context.bodyClasses[index]}
            tooltip={this.context.bodyTooltips[index]}
          />
        );
      } else {
        return (
          <BodyCell
            key={index}
            datum={this.props.datum}
            field={field}
            value={this.context.bodyValues[index]}
            fullValue={this.context.bodyFullValues[index]}
            style={this.context.bodyStyles[index]}
            className={this.context.bodyClasses[index]}
            tooltip={this.context.bodyTooltips[index]}
          />
        );
      }
    });
    return <tr>{cells}</tr>;
  }
}
BodyRow.contextType = TableContext;

// body checkbox cell
// contains checkbox for column whose head is also a checkbox
class BodyCheckboxCell extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    // temporary checked state for dragging
    this.tempChecked = null;

    this.onCtrlClick = this.onCtrlClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    window.addEventListener('mouseup', this.onMouseUp);
  }

  // when component unmounts
  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  // on ctrl+click
  onCtrlClick() {
    this.context.soloChecked(this.props.datum[rowIndexKey], this.props.field);
  }

  // on mouse down over button
  onMouseDown() {
    this.context.beginDrag(this.props.field, !this.props.checked);
    this.context.addToDragList(this.props.datum[rowIndexKey]);
    this.setState({ tempChecked: !this.props.checked });
  }

  // on mouse move over button
  onMouseMove() {
    // if this column is the column being dragged, add self to drag list
    if (
      this.context.dragField === this.props.field &&
      typeof this.context.dragValue === 'boolean'
    ) {
      this.context.addToDragList(this.props.datum[rowIndexKey]);
      this.setState({ tempChecked: this.context.dragValue });
    }
  }

  // on mouse up anywhere
  onMouseUp() {
    // reset temp checked state to nothing
    this.setState({ tempChecked: null });
  }

  // display component
  render() {
    const style = propValOrFunc(this.props, 'style', 'datum', {});
    const className = propValOrFunc(this.props, 'className', 'datum', '');
    const tooltip = propValOrFunc(this.props, 'tooltip', 'datum', '');

    let checked;
    if (typeof this.state.tempChecked === 'boolean')
      checked = this.state.tempChecked;
    else
      checked = this.props.checked;

    return (
      <Tooltip text={tooltip}>
        <td style={style} className={className}>
          <Button
            className={'table_button'}
            onCtrlClick={this.onCtrlClick}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
          >
            <div data-checked={checked}>{this.props.content}</div>
          </Button>
        </td>
      </Tooltip>
    );
  }
}
BodyCheckboxCell.contextType = TableContext;

// body cell
// contains one piece of information from row/datum
class BodyCell extends Component {
  // display component
  render() {
    const style = propValOrFunc(this.props, 'style', 'datum', {});
    const className = propValOrFunc(this.props, 'className', 'datum', '');
    const tooltip = propValOrFunc(this.props, 'tooltip', 'datum', '');
    const value =
      propValOrFunc(this.props, 'value', 'datum', '') ||
      this.props.datum[this.props.field];
    const fullValue =
      propValOrFunc(this.props, 'fullValue', 'datum', '') ||
      this.props.datum[this.props.field];

    return (
      <Tooltip text={tooltip}>
        <td
          style={style}
          className={className}
          data-highlighted={
            this.props.datum[cellHighlightKey] === this.props.field
              ? 'true'
              : 'false'
          }
        >
          <DynamicField value={value} fullValue={fullValue} />
        </td>
      </Tooltip>
    );
  }
}
BodyCell.contextType = TableContext;

// helper function to get value of prop, or value returned from prop function
function propValOrFunc(props, prop, datum, blank) {
  prop = props[prop];
  datum = props[datum];

  if (typeof prop === 'function')
    return prop(datum) || blank;
  else
    return prop || blank;
}

// controls section
// contains search, pagination, and more
class Controls extends Component {
  // display component
  render() {
    return (
      <div className='table_controls'>
        <PerPage />
        <Nav />
        <Search />
      </div>
    );
  }
}

// page navigation component
// contains arrow buttons to previous/next pages, and X/N page info
class Nav extends Component {
  // display component
  render() {
    return (
      <div
        className='table_nav'
        onMouseEnter={() => this.context.setHovered(true)}
        onMouseLeave={() => this.context.setHovered(false)}
      >
        <Button
          tooltipText='Go to first page'
          className='table_nav_button'
          disabled={this.context.page <= 1}
          onClick={() => this.context.setPage(1)}
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} className='fa-sm' />
        </Button>
        <Button
          tooltipText='Go to previous page'
          className='table_nav_button'
          disabled={this.context.page <= 1}
          onClick={() => this.context.setPage(this.context.page - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} className='fa-sm' />
        </Button>
        <Tooltip text='Pages'>
          <span>
            {this.context.page} of {this.context.pages || 1}
          </span>
        </Tooltip>
        <Button
          tooltipText='Go to next page'
          className='table_nav_button'
          disabled={this.context.page >= this.context.pages}
          onClick={() => this.context.setPage(this.context.page + 1)}
        >
          <FontAwesomeIcon icon={faAngleRight} className='fa-sm' />
        </Button>
        <Button
          tooltipText='Go to last page'
          className='table_nav_button'
          disabled={this.context.page >= this.context.pages}
          onClick={() => this.context.setPage(this.context.pages)}
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} className='fa-sm' />
        </Button>
      </div>
    );
  }
}
Nav.contextType = TableContext;

// per page component
// ie, show X entries per page
class PerPage extends Component {
  // when selection changes
  onChange = (event) => {
    if (event && event.target && this.context.setPerPage)
      this.context.setPerPage(event.target.value);
  };

  // display component
  render() {
    return (
      <div
        className='table_per_page'
        onMouseEnter={() => this.context.setHovered(true)}
        onMouseLeave={() => this.context.setHovered(false)}
      >
        <div className='table_input'>
          <Tooltip text='Rows to show per page'>
            <select
              value={String(this.context.perPage)}
              onChange={this.onChange}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
              <option value='500'>500</option>
              <option value='1000'>1000</option>
            </select>
          </Tooltip>
          <FontAwesomeIcon icon={faListOl} className='fa-sm' />
        </div>
      </div>
    );
  }
}
PerPage.contextType = TableContext;

// search textbox component
class Search extends Component {
  // intialize component
  constructor() {
    super();

    this.ref = React.createRef();
  }
  // when user types into box
  onInput = (event) => {
    if (event && event.target && this.context.onSearch)
      this.context.onSearch(event.target.value);
  };

  // when user clicks button
  onClick = () => {
    this.ref.current.focus();
    this.ref.current.value = '';
    this.context.onSearch('');
  };

  // display component
  render() {
    return (
      <Tooltip text='Search table'>
        <div className='table_search'>
          <div className='table_input'>
            <input ref={this.ref} type='text' onInput={this.onInput} />
            {!this.context.searchString && (
              <FontAwesomeIcon icon={faSearch} className='fa-sm' />
            )}
            {this.context.searchString && (
              <button onClick={this.onClick}>
                <FontAwesomeIcon icon={faTimes} className='fa-sm' />
              </button>
            )}
          </div>
          {this.context.searchString && (
            <span>{this.context.searchResults} results</span>
          )}
        </div>
      </Tooltip>
    );
  }
}
Search.contextType = TableContext;
