import React from 'react';
import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons';
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';

import { Button } from './buttons.js';
import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import './table.css';

const defaultWidth = 200;
const defaultAlign = 'center';

export class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.data = [];
    this.state.sortField = this.props.defaultSortField;
    this.state.sortUp = this.props.defaultSortUp;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.data !== prevProps.data ||
      this.state.sortField !== prevState.sortField ||
      this.state.sortUp !== prevState.sortUp
    )
      this.setState({ data: this.sortData(this.props.data) });
  }

  changeSort = (field) => {
    const newState = {};
    newState.sortField = field;

    if (field === this.state.sortField)
      newState.sortUp = !this.state.sortUp;
    else
      newState.sortUp = true;

    this.setState(newState);
  };

  sortData = (data) => {
    for (let index = 0; index < data.length; index++)
      data[index].originalIndex = index;

    data.sort((a, b) => this.standardCompare(a, b, this.state.sortField));

    // reverse sort direction
    if (this.state.sortUp)
      data.reverse();

    return data;
  };

  // compare function for sorting
  standardCompare = (a, b, key) => {
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
  };

  render() {
    return (
      <table>
        <thead>
          <Super
            contents={this.props.superContents}
            widths={this.props.superWidths}
            aligns={this.props.superAligns}
            colspans={this.props.superColspans}
            tooltips={this.props.superTooltips}
          />
          <Head
            contents={this.props.headContents}
            fields={this.props.headFields}
            widths={this.props.headWidths}
            aligns={this.props.headAligns}
            tooltips={this.props.headTooltips}
            sortField={this.state.sortField}
            sortUp={this.state.sortUp}
            changeSort={this.changeSort}
          />
        </thead>
        <tbody>
          <Body
            data={this.state.data}
            headContents={this.props.headContents}
            headFields={this.props.headFields}
            headAligns={this.props.headAligns}
            values={this.props.bodyValues}
            fullValues={this.props.bodyFullValues}
            colors={this.props.bodyColors}
            tooltips={this.props.bodyTooltips}
          />
        </tbody>
      </table>
    );
  }
}

class Super extends Component {
  render() {
    const cells = this.props.contents.map((content, index) => (
      <SuperCell
        key={index}
        content={content}
        width={this.props.widths[index] || defaultWidth}
        align={this.props.aligns[index] || defaultAlign}
        colspan={this.props.colspans[index] || 1}
        tooltip={this.props.tooltips[index] || ''}
      />
    ));

    if (cells.length > 0)
      return <tr>{cells}</tr>;
    else
      return <></>;
  }
}

class SuperCell extends Component {
  render() {
    return (
      <Tooltip text={this.props.tooltip}>
        <th
          style={{ width: this.props.width }}
          className={'small ' + this.props.align}
          colSpan={this.props.colspan}
        >
          {this.props.content}
        </th>
      </Tooltip>
    );
  }
}

class Head extends Component {
  render() {
    const cells = this.props.contents.map((content, index) => {
      if (typeof content.type === 'function') {
        return (
          <HeadCheckboxCell
            key={index}
            content={content}
            field={this.props.fields || null}
            width={this.props.widths[index] || defaultWidth}
            align={this.props.aligns[index] || defaultAlign}
            tooltip={this.props.tooltips[index] || ''}
          />
        );
      } else {
        return (
          <HeadCell
            key={index}
            content={content}
            field={this.props.fields[index] || null}
            width={this.props.widths[index] || defaultWidth}
            align={this.props.aligns[index] || defaultAlign}
            tooltip={this.props.tooltips[index] || ''}
            sortField={this.props.sortField}
            sortUp={this.props.sortUp}
            changeSort={this.props.changeSort}
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

class HeadCheckboxCell extends Component {
  render() {
    return (
      <Tooltip text={this.props.tooltip}>
        <th style={{ width: this.props.width }}>
          <Button className={'table_button ' + this.props.align}>
            {this.props.content}
          </Button>
        </th>
      </Tooltip>
    );
  }
}

class HeadCell extends Component {
  render() {
    return (
      <Tooltip text={this.props.tooltip}>
        <th style={{ width: this.props.width }}>
          <Button
            className={'table_button ' + this.props.align}
            onClick={() => this.props.changeSort(this.props.field)}
          >
            <span className='small'>{this.props.content}</span>
            <FontAwesomeIcon
              style={{
                opacity: this.props.field === this.props.sortField ? 1 : 0.1
              }}
              icon={
                this.props.field === this.props.sortField
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

class Body extends Component {
  render() {
    const rows = this.props.data.map((datum, index) => (
      <BodyRow
        key={index}
        datum={datum}
        headContents={this.props.headContents}
        headFields={this.props.headFields}
        headAligns={this.props.headAligns}
        values={this.props.values}
        fullValues={this.props.fullValues}
        colors={this.props.colors}
        tooltips={this.props.tooltips}
      />
    ));
    return <>{rows}</>;
  }
}

class BodyRow extends Component {
  render() {
    const cells = this.props.headFields.map((field, index) => {
      if (typeof this.props.headContents[index].type === 'function') {
        return (
          <BodyCheckboxCell
            key={index}
            checked={this.props.datum[field] ? true : false}
            content={this.props.headContents[index]}
            align={this.props.headAligns[index] || defaultAlign}
            tooltip={this.props.tooltips[index](this.props.datum) || ''}
          />
        );
      } else {
        return (
          <BodyCell
            key={index}
            value={
              this.props.values[index]
                ? this.props.values[index](this.props.datum)
                : this.props.datum[field]
            }
            fullValue={
              this.props.fullValues[index]
                ? this.props.fullValues[index](this.props.datum)
                : this.props.datum[field]
            }
            align={this.props.headAligns[index] || defaultAlign}
            color={
              this.props.colors[index]
                ? this.props.colors[index](this.props.datum)
                : ''
            }
            tooltip={
              this.props.tooltips[index]
                ? this.props.tooltips[index](this.props.datum)
                : ''
            }
          />
        );
      }
    });
    return <tr>{cells}</tr>;
  }
}

class BodyCheckboxCell extends Component {
  render() {
    return (
      <Tooltip text={this.props.tooltip}>
        <td>
          <Button className={'table_button ' + this.props.align}>
            <div style={{ opacity: this.props.checked ? 1 : 0.1 }}>
              {this.props.content}
            </div>
          </Button>
        </td>
      </Tooltip>
    );
  }
}

class BodyCell extends Component {
  render() {
    return (
      <Tooltip text={this.props.tooltip}>
        <td style={{ background: this.props.color }}>
          <DynamicField
            className={this.props.align}
            value={this.props.value}
            fullValue={this.props.fullValue}
          />
        </td>
      </Tooltip>
    );
  }
}