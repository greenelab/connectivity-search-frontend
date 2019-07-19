import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';

import { Button } from './buttons.js';
import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import { compareObjects } from '../util/object.js';
import { copyObject } from '../util/object.js';

import './table.css';

// generic table component
// contains three sections: super (row above head), head, and body
// contents, styles, and classes can be specified for all sections
// tooltips can be specified for head and body
// colspans can be specified for super
// custom sort function can be specified
// supports img or font-awesome checkboxes
export class Table extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.state = {};
    this.state.data = [];
    this.state.sortField = this.props.defaultSortField || '';
    this.state.sortUp = this.props.defaultSortUp || false;

    this.state.onChange = this.props.onChange || (() => null);
  }

  // when component mounts
  componentDidMount() {
    this.setState({ data: this.sortData(this.props.data) });
  }

  // when component updates
  componentDidUpdate(prevProps, prevState) {
    if (
      !compareObjects(this.props.data, prevProps.data) ||
      this.state.sortField !== prevState.sortField ||
      this.state.sortUp !== prevState.sortUp
    )
      this.setState({ data: this.sortData(this.props.data) });
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
    // get compare function from props or standard/default compare
    let compare = this.standardCompare;
    if (
      this.props.compareFunction &&
      this.props.compareFunction(this.state.sortField)
    )
      compare = this.props.compareFunction(this.state.sortField);

    const originalData = copyObject(data);

    // sort
    data.sort((a, b) =>
      compare(a, b, this.state.sortField, this.state.sortUp, originalData)
    );

    // reverse sort direction
    if (this.state.sortUp)
      data.reverse();

    return data;
  };

  // compare function for sorting
  standardCompare = (a, b, key, sortUp, original) => {
    // get values
    const aValue = Number(a[key]);
    const bValue = Number(b[key]);

    // get whether a and b are numbers
    const aIsNum = !Number.isNaN(aValue);
    const bIsNum = !Number.isNaN(bValue);

    // get original positions in array
    const aIndex = original.findIndex((element) => compareObjects(element, a));
    const bIndex = original.findIndex((element) => compareObjects(element, b));

    // if both are numbers, compare by values, or by index if values are the
    // same (to preserve original order)
    if (aIsNum && bIsNum) {
      if (aValue - bValue !== 0)
        return aValue - bValue;
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
          data: this.state.data || [],
          sortField: this.state.sortField,
          sortUp: this.state.sortUp,
          toggleChecked: this.toggleChecked,
          soloChecked: this.soloChecked,
          allChecked: this.allChecked,
          toggleAll: this.toggleAll,
          changeSort: this.changeSort,
          superContents: this.props.superContents || [],
          superStyles: this.props.superStyles || [],
          superClasses: this.props.superClasses || [],
          superColspans: this.props.superColspans || [],
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
        <table className={this.props.className}>
          <thead>
            <Super />
            <Head />
          </thead>
          <tbody>
            <Body />
          </tbody>
        </table>
      </TableContext.Provider>
    );
  }
}
const TableContext = React.createContext({});

// super section
// row above head row
class Super extends Component {
  // display component
  render() {
    const cells = this.context.superContents.map((content, index) => (
      <SuperCell
        key={index}
        content={content}
        style={this.context.superStyles[index]}
        className={this.context.superClasses[index]}
        colspan={this.context.superColspans[index]}
      />
    ));

    if (cells.length > 0)
      return <tr>{cells}</tr>;
    else
      return <></>;
  }
}
Super.contextType = TableContext;

// super cell
class SuperCell extends Component {
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
SuperCell.contextType = TableContext;

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
            <span
              style={{
                opacity: this.context.allChecked(this.props.field) ? 1 : 0.1
              }}
            >
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
              style={{
                opacity: this.props.field === this.context.sortField ? 1 : 0.1
              }}
              icon={
                this.props.field === this.context.sortField
                  ? this.context.sortUp
                    ? faLongArrowAltUp
                    : faLongArrowAltDown
                  : faLongArrowAltUp
              }
              className='fa-lg sort_icon'
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
            <div style={{ opacity: this.props.checked ? 1 : 0.1 }}>
              {this.props.content}
            </div>
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
