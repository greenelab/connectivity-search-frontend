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
    this.state.sortField = this.props.defaultSortField;
    this.state.sortUp = this.props.defaultSortUp;

    this.state.compareFunction =
      this.props.compareFunction || this.standardCompare;
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
    const compare =
      this.props.compareFunction(this.state.sortField) || this.standardCompare;

    // sort
    data.sort((a, b) => compare(a, b, this.state.sortField));

    // reverse sort direction
    if (this.state.sortUp)
      data.reverse();

    return data;
  };

  // compare function for sorting
  standardCompare = (a, b, key) => {
    a = a[key];
    b = b[key];
    // parse as numbers
    const comparison = Number(a) - Number(b);
    if (!Number.isNaN(comparison))
      return comparison;

    // otherwise parse as strings and compare alphabetically
    if (a < b)
      return -1;
    else if (a > b)
      return 1;
    else
      return 0;
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
          data: this.state.data,
          sortField: this.state.sortField,
          sortUp: this.state.sortUp,
          toggleChecked: this.toggleChecked,
          soloChecked: this.soloChecked,
          allChecked: this.allChecked,
          toggleAll: this.toggleAll,
          changeSort: this.changeSort,
          superContents: this.props.superContents,
          superWidths: this.props.superWidths,
          superAligns: this.props.superAligns,
          superColspans: this.props.superColspans,
          headContents: this.props.headContents,
          headFields: this.props.headFields,
          headWidths: this.props.headWidths,
          headAligns: this.props.headAligns,
          headTooltips: this.props.headTooltips,
          bodyValues: this.props.bodyValues,
          bodyFullValues: this.props.bodyFullValues,
          bodyColors: this.props.bodyColors,
          bodyTooltips: this.props.bodyTooltips
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
        width={this.context.superWidths[index]}
        align={this.context.superAligns[index]}
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
        style={{ width: this.props.width || 'unset' }}
        className={'small ' + (this.props.align || '')}
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
            width={this.context.headWidths[index]}
            align={this.context.headAligns[index]}
            tooltip={this.context.headTooltips[index]}
          />
        );
      } else {
        return (
          <HeadCell
            key={index}
            content={content}
            field={this.context.headFields[index]}
            width={this.context.headWidths[index]}
            align={this.context.headAligns[index]}
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
        <th style={{ width: this.props.width || 'unset' }}>
          <Button
            className={'table_button ' + (this.props.align || '')}
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
        <th style={{ width: this.props.width || 'unset' }}>
          <Button
            className={'table_button ' + (this.props.align || '')}
            onClick={() => this.context.changeSort(this.props.field)}
          >
            <span className='small'>{this.props.content}</span>
            <FontAwesomeIcon
              style={{
                opacity: this.props.field === this.context.sortField ? 1 : 0.1
              }}
              icon={
                this.props.field === this.context.sortField
                  ? this.props.sortUp
                    ? faLongArrowAltUp
                    : faLongArrowAltDown
                  : faLongArrowAltUp
              }
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
            checked={this.props.datum[field] ? true : false}
            content={this.context.headContents[index]}
            align={this.context.headAligns[index]}
            tooltip={
              this.context.bodyTooltips[index]
                ? this.context.bodyTooltips[index](this.props.datum)
                : ''
            }
          />
        );
      } else {
        return (
          <BodyCell
            key={index}
            value={
              this.context.bodyValues[index]
                ? this.context.bodyValues[index](this.props.datum)
                : this.props.datum[field]
            }
            fullValue={
              this.context.bodyFullValues[index]
                ? this.context.bodyFullValues[index](this.props.datum)
                : this.props.datum[field]
            }
            align={this.context.headAligns[index]}
            color={
              this.context.bodyColors[index]
                ? this.context.bodyColors[index](this.props.datum)
                : ''
            }
            tooltip={
              this.context.bodyTooltips[index]
                ? this.context.bodyTooltips[index](this.props.datum)
                : ''
            }
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
    return (
      <Tooltip text={this.props.tooltip || ''}>
        <td>
          <Button
            className={'table_button ' + (this.props.align || '')}
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
    return (
      <Tooltip text={this.props.tooltip || ''}>
        <td style={{ background: this.props.color || 'none' }}>
          <DynamicField
            className={this.props.align || ''}
            value={this.props.value || '-'}
            fullValue={this.props.fullValue || '-'}
          />
        </td>
      </Tooltip>
    );
  }
}
BodyCell.contextType = TableContext;
