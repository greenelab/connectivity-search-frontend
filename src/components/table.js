import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faListOl } from '@fortawesome/free-solid-svg-icons';

import { Button } from './buttons.js';
import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import { compareObjects } from '../util/object.js';
import { copyObject } from '../util/object.js';

import './table.css';

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

    this.state = {};
    this.state.data = [];
    this.state.sortedData = [];
    this.state.filteredData = [];
    this.state.paginatedData = [];
    this.state.sortField = this.props.defaultSortField || '';
    this.state.sortUp = this.props.defaultSortUp || false;
    this.state.searchString = '';
    this.state.page = 1;
    this.state.pages = 1;
    this.state.perPage = 10;

    this.state.onChange = this.props.onChange || (() => null);
  }

  // when component mounts
  componentDidMount() {
    this.setState({ sortedData: this.sortData(this.props.data) });
  }

  // when component updates
  componentDidUpdate(prevProps, prevState) {
    const newState = {};
    // if input data changes or sort column changes
    // update sorted data
    if (
      !compareObjects(this.props.data, prevProps.data) ||
      this.state.sortField !== prevState.sortField ||
      this.state.sortUp !== prevState.sortUp
    )
      newState.sortedData = this.sortData(this.props.data);

    // if sorted data changes or search string changes
    // update filtered data
    if (
      !compareObjects(this.state.sortedData, prevState.sortedData) ||
      this.state.searchString !== prevState.searchString
    ) {
      newState.filteredData = this.filterData(this.state.sortedData);
      if (this.state.searchString !== prevState.searchString)
        newState.page = 1;
    }

    // if filtered data changes or page controls change
    // update paginated data
    if (
      !compareObjects(this.state.filteredData, prevState.filteredData) ||
      this.state.page !== prevState.page ||
      this.state.perPage !== prevState.perPage
    ) {
      newState.paginatedData = this.paginateData(this.state.filteredData);
      newState.pages = this.calcPages();
    }

    // if paginated data changes
    // update main final data var that is passed to children for render
    if (!compareObjects(this.state.paginatedData, prevState.paginatedData))
      newState.data = this.state.paginatedData;

    // set new state, if any
    if (Object.keys(newState).length > 0)
      this.setState(newState);
  }

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

  // sort table data based on sort field and direction
  sortData = (data) => {
    data = copyObject(data);

    // get sort function from props or standard/default sort
    let func;
    if (this.props.sortFunction)
      func = this.props.sortFunction(this.state.sortField);
    if (typeof func !== 'function')
      func = this.defaultSort;

    // keep immutable copy of data before sort
    // if just "data" was used, it would change throughout sort()
    const originalData = copyObject(data);

    // sort
    data.sort((a, b) =>
      func(a, b, this.state.sortField, this.state.sortUp, originalData)
    );

    // reverse sort direction
    if (this.state.sortUp)
      data.reverse();

    return data;
  };

  // compare function for sorting
  defaultSort = (a, b, key, sortUp, original) => {
    // get values
    const aValue = a[key];
    const bValue = b[key];

    // get values
    const aNum = Number(aValue);
    const bNum = Number(bValue);

    // get whether a and b are numbers
    const aIsNum = !Number.isNaN(aNum);
    const bIsNum = !Number.isNaN(bNum);

    // get original positions in array
    const aIndex = original.findIndex((element) => compareObjects(element, a));
    const bIndex = original.findIndex((element) => compareObjects(element, b));

    // if both are numbers, compare by values, or by index if values are the
    // same (to preserve original order)
    if (aIsNum && bIsNum) {
      if (aNum - bNum !== 0)
        return aNum - bNum;
      else
        return sortUp ? bIndex - aIndex : aIndex - bIndex;
    }

    // if one is a number and the other is not, always put the NaN vertically
    // below the number
    if (!aIsNum && bIsNum)
      return sortUp ? -1 : 1;
    if (aIsNum && !bIsNum)
      return sortUp ? 1 : -1;

    // if neither are numbers, compare alphabetically, or by index if values
    // are the same (to preserve original order)
    if (aValue < bValue)
      return -1;
    else if (aValue > bValue)
      return 1;
    else
      return sortUp ? bIndex - aIndex : aIndex - bIndex;
  };

  // when user types into searchbox
  onSearch = (value) => {
    this.setState({ searchString: value });
  };

  // filter table based on search textbox
  filterData = (data) => {
    data = copyObject(data);

    if (!this.state.searchString)
      return data;

    return data.filter((datum) => {
      for (const key of Object.keys(datum)) {
        if (
          String(datum[key])
            .toLowerCase()
            .includes(this.state.searchString.toLowerCase())
        )
          return true;
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
  calcPages = () => {
    return Math.ceil(this.state.filteredData.length / this.state.perPage);
  };

  // toggles checkbox on/off
  toggleChecked = (datum, field) => {
    const newData = copyObject(this.props.data);

    for (const row of newData) {
      if (compareObjects(row, datum))
        row[field] = !row[field];
    }

    this.state.onChange(newData);
  };

  // solo checkbox (turn all others off)
  soloChecked = (datum, field) => {
    const newData = copyObject(this.props.data);

    let allOthersUnchecked = true;
    for (const row of newData) {
      if (!compareObjects(row, datum) && row[field]) {
        allOthersUnchecked = false;
        break;
      }
    }

    for (const row of newData) {
      if (allOthersUnchecked || compareObjects(row, datum))
        row[field] = true;
      else
        row[field] = false;
    }

    this.state.onChange(newData);
  };

  // checks whether all checkboxes are checked
  allChecked = (field) => {
    for (const datum of this.props.data) {
      if (!datum[field])
        return false;
    }

    return true;
  };

  // check or uncheck all checkboxes
  toggleAll = (field) => {
    const newData = copyObject(this.props.data);

    const newChecked = !this.allChecked(field);
    for (const datum of newData)
      datum[field] = newChecked;

    this.state.onChange(newData);
  };

  // display component
  render() {
    return (
      <TableContext.Provider
        value={{
          data: this.state.data,
          sortedData: this.state.sortedData,
          filteredData: this.state.filteredData,
          sortField: this.state.sortField,
          sortUp: this.state.sortUp,
          onSearch: this.onSearch,
          searchString: this.state.searchString,
          page: this.state.page,
          pages: this.state.pages,
          perPage: this.state.perPage,
          setPerPage: this.setPerPage,
          setPage: this.setPage,
          toggleChecked: this.toggleChecked,
          soloChecked: this.soloChecked,
          allChecked: this.allChecked,
          toggleAll: this.toggleAll,
          changeSort: this.changeSort,
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
        <div className={this.props.containerClass}>
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
            <FontAwesomeIcon
              data-disabled={this.props.field !== this.context.sortField}
              icon={
                this.props.field === this.context.sortField
                  ? this.context.sortUp
                    ? faLongArrowAltUp
                    : faLongArrowAltDown
                  : faLongArrowAltUp
              }
              className='fa-lg table_sort_icon'
            />
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
  // display component
  render() {
    const style = propValOrFunc(this.props, 'style', 'datum', {});
    const className = propValOrFunc(this.props, 'className', 'datum', '');
    const tooltip = propValOrFunc(this.props, 'tooltip', 'datum', '');

    return (
      <Tooltip text={tooltip}>
        <td style={style} className={className}>
          <Button
            className={'table_button'}
            onClick={() =>
              this.context.toggleChecked(this.props.datum, this.props.field)
            }
            onCtrlClick={() =>
              this.context.soloChecked(this.props.datum, this.props.field)
            }
          >
            <div data-checked={this.props.checked}>{this.props.content}</div>
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
        <td style={style} className={className}>
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
class Nav extends Component {
  // display component
  render() {
    return (
      <div className='table_nav'>
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
      <div className='table_per_page'>
        <form>
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
        </form>
      </div>
    );
  }
}
PerPage.contextType = TableContext;

// search textbox component
class Search extends Component {
  // when user types into box
  onInput = (event) => {
    if (event && event.target && this.context.onSearch)
      this.context.onSearch(event.target.value);
  };

  // display component
  render() {
    return (
      <Tooltip text='Search table'>
        <div className='table_search'>
          <form>
            <input type='text' onInput={this.onInput} />
            <FontAwesomeIcon icon={faSearch} className='fa-sm' />
          </form>
          {this.context.searchString && (
            <span>{this.context.filteredData.length} results</span>
          )}
        </div>
      </Tooltip>
    );
  }
}
Search.contextType = TableContext;
