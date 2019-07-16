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

//
export class Table extends Component {
  // initialize component
  constructor(props) {
    super(props);

    this.state = {};
    this.state.data = [];
    this.state.sortField = this.props.defaultSortField || '';
    this.state.sortUp = this.props.defaultSortUp || true;

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

  //
  changeSort = (field) => {
    const newState = {};
    newState.sortField = field;

    if (field === this.state.sortField)
      newState.sortUp = !this.state.sortUp;
    else
      newState.sortUp = true;

    this.setState(newState);
  };

  //
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
    data.sort((a, b) => compare(a, b, this.state.sortField, originalData));

    // reverse sort direction
    if (this.state.sortUp)
      data.reverse();

    return data;
  };

  // compare function for sorting
  standardCompare = (a, b, key, original) => {
    // get values
    const aValue = a[key];
    const bValue = b[key];

    // get original positions in array
    const aIndex = original.findIndex((element) => compareObjects(element, a));
    const bIndex = original.findIndex((element) => compareObjects(element, b));

    // parse as numbers
    const comparison = Number(aValue) - Number(bValue);
    if (!Number.isNaN(comparison)) {
      // if equal, preserve original order
      if (comparison === 0)
        return bIndex - aIndex;
      else
        return comparison;
    }

    // otherwise parse as strings and compare alphabetically
    if (aValue < bValue)
      return -1;
    else if (aValue > bValue)
      return 1;
    else
      return bIndex - aIndex;
    // if equal, preserve original order
  };

  // toggles the specified checkbox on/off
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

  // checks whether all are checked
  allChecked = (field) => {
    for (const datum of this.props.data) {
      if (!datum[field])
        return false;
    }

    return true;
  };

  toggleAll = (field) => {
    const newData = copyObject(this.props.data);

    const newChecked = !this.allChecked(field);
    for (const datum of newData)
      datum[field] = newChecked;

    this.state.onChange(newData);
  };

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

class Super extends Component {
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

class SuperCell extends Component {
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

class Head extends Component {
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

class HeadCheckboxCell extends Component {
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

class HeadCell extends Component {
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

class Body extends Component {
  render() {
    const rows = this.context.data.map((datum, index) => (
      <BodyRow key={index} datum={datum} />
    ));
    return <>{rows}</>;
  }
}
Body.contextType = TableContext;

class BodyRow extends Component {
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

class BodyCheckboxCell extends Component {
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

class BodyCell extends Component {
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
