import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { Button } from './buttons.js';
import { Tooltip } from './tooltip.js';
import { DynamicField } from './dynamic-field.js';
import './table.css';

export class Test extends Component {
  render() {
    return (
      <Table
        data={this.props.metapaths}
        superContents={[
          '',
          '',
          '',
          '',
          '',
          '',
          <div className='line_sides'>Null DWPC distribution information</div>,
          ''
        ]}
        superWidths={[30, 200, 80, 100, 100, 80, 600, 200]}
        superAligns={[]}
        superColspans={[1, 1, 1, 1, 1, 1, 6, 1]}
        superTooltips={[
          '',
          '',
          '',
          '',
          '',
          '',
          'Null DWPC distribution information',
          ''
        ]}
        headContents={[
          <FontAwesomeIcon className='fa-xs' icon={faCheck} />,
          'metapath',
          'path count',
          <span>
            adjusted
            <br />
            <i>p</i>-value
          </span>,
          <>
            <i>p</i>-value
          </>,
          'DWPC',
          'source degree',
          'target degree',
          "# DWPC's",
          "# non-0 DWPC's",
          'non-0 mean',
          <>non-0 &sigma;</>,
          <a
            href='https://neo4j.het.io/browser/'
            target='_blank'
            rel='noopener noreferrer'
            onClick={(event) => event.stopPropagation()}
          >
            neo4j query
          </a>
        ]}
        headFields={[
          'checked',
          'metapath_metaedges',
          'path_count',
          'adjusted_p_value',
          'p_value',
          'dwpc',
          'dgp_source_degree',
          'dgp_target_degree',
          'dgp_n_dwpcs',
          'dgp_n_nonzero_dwpcs',
          'dgp_nonzero_mean',
          'dgp_nonzero_sd',
          'cypher_query'
        ]}
        headWidths={[30, 200, 80, 100, 100, 80]}
        headAligns={['', 'left']}
        headTooltips={[
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text',
          'tooltip text'
        ]}
      />
    );
  }
}
Test = connect((state) => ({
  metapaths: state.metapaths
}))(Test);

const defaultWidth = 200;
const defaultAlign = 'center';

export class Table extends Component {
  render() {
    return (
      <table>
        <thead className='small'>
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
          />
        </thead>
        <tbody>
          <Body
            data={this.props.data}
            headContents={this.props.headContents}
            headFields={this.props.headFields}
            headAligns={this.props.headAligns}
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
        contents={content}
        width={this.props.widths[index] || defaultWidth}
        align={this.props.aligns[index] || defaultAlign}
        colspan={this.props.colspans[index] || 1}
        tooltip={this.props.tooltips[index] || ''}
      />
    ));

    if (cells.length > 0) return <tr>{cells}</tr>;
    else return <></>;
  }
}

class SuperCell extends Component {
  render() {
    return (
      <Tooltip text={this.props.tooltip}>
        <th
          style={{ width: this.props.width }}
          className={this.props.align}
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
            field={this.props.fields || null}
            width={this.props.widths[index] || defaultWidth}
            align={this.props.aligns[index] || defaultAlign}
            tooltip={this.props.tooltips[index] || ''}
          />
        );
      }
    });

    if (cells.length > 0) return <tr>{cells}</tr>;
    else return <></>;
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
          <Button className={'table_button ' + this.props.align}>
            {this.props.content}
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
            value={this.props.datum[field]}
            align={this.props.headAligns[index] || defaultAlign}
          />
        );
      } else return <BodyCell key={index} value={this.props.datum[field]} />;
    });
    return <tr>{cells}</tr>;
  }
}

class BodyCheckboxCell extends Component {
  render() {
    return (
      <Tooltip text='tooltip text'>
        <td>
          <Button className={'table_button ' + this.props.align}>
            {this.props.content}
          </Button>
        </td>
      </Tooltip>
    );
  }
}

class BodyCell extends Component {
  render() {
    return (
      <Tooltip text='tooltip text'>
        <td>
          <DynamicField />
        </td>
      </Tooltip>
    );
  }
}
