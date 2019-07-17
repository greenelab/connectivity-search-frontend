import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { ReactComponent as ArrowBoth } from '../images/arrow-icon-both.svg';
import { ReactComponent as ArrowForward } from '../images/arrow-icon-forward.svg';
import { ReactComponent as ArrowBackward } from '../images/arrow-icon-backward.svg';

import { ReactComponent as Gene } from '../images/chip-gene.svg';
import { ReactComponent as Compound } from '../images/chip-compound.svg';
import { ReactComponent as Anatomy } from '../images/chip-anatomy.svg';
import { ReactComponent as Disease } from '../images/chip-disease.svg';
import { ReactComponent as Symptom } from '../images/chip-symptom.svg';
import { ReactComponent as SideEffect } from '../images/chip-side-effect.svg';
import { ReactComponent as BiologicalProcess } from '../images/chip-biological-process.svg';
import { ReactComponent as CellularComponent } from '../images/chip-cellular-component.svg';
import { ReactComponent as MolecularFunction } from '../images/chip-molecular-function.svg';
import { ReactComponent as Pathway } from '../images/chip-pathway.svg';
import { ReactComponent as PharmacologicClass } from '../images/chip-pharmacologic-class.svg';

import './chips.css';

// metanode "chip" component
// colored circle with abbreviation text in middle
// eg (G) for "gene"
export class MetanodeChip extends Component {
  // display component
  render() {
    // get icon
    let icon;
    switch (this.props.type) {
      case 'Gene':
        icon = <Gene />;
        break;
      case 'Compound':
        icon = <Compound />;
        break;
      case 'Anatomy':
        icon = <Anatomy />;
        break;
      case 'Disease':
        icon = <Disease />;
        break;
      case 'Symptom':
        icon = <Symptom />;
        break;
      case 'Side Effect':
        icon = <SideEffect />;
        break;
      case 'Biological Process':
        icon = <BiologicalProcess />;
        break;
      case 'Cellular Component':
        icon = <CellularComponent />;
        break;
      case 'Molecular Function':
        icon = <MolecularFunction />;
        break;
      case 'Pathway':
        icon = <Pathway />;
        break;
      case 'Pharmacologic Class':
        icon = <PharmacologicClass />;
        break;
      default:
        break;
    }

    let fillColor = '#424242';
    let textColor = '#fafafa';
    let style = {};
    if (this.props.hetioStyles)
      style = this.props.hetioStyles[this.props.type];
    if (style && style.fill_color)
      fillColor = style.fill_color;
    if (style && style.text_color)
      textColor = style.text_color;

    return (
      <div className='metanode_chip' style={{ color: textColor }}>
        <svg viewBox='0 0 100 100'>
          <circle cx='50' cy='50' r='49' fill={fillColor} />
        </svg>
        {icon}
      </div>
    );
  }
}
// connect component to global state
MetanodeChip = connect((state) => ({
  hetioStyles: state.hetioStyles
}))(MetanodeChip);

// metaedge "chip" component
// svg arrow with abbreviation text above
export class MetaedgeChip extends Component {
  // display component
  render() {
    // get edge direction icon
    let icon;
    switch (this.props.direction) {
      case 'backward':
        icon = <ArrowBackward />;
        break;
      case 'forward':
        icon = <ArrowForward />;
        break;
      default:
        icon = <ArrowBoth />;
        break;
    }

    let abbreviation = '';
    if (this.props.metagraph && this.props.metagraph.kind_to_abbrev)
      abbreviation = this.props.metagraph.kind_to_abbrev[this.props.type];

    return (
      <div
        className='metaedge_chip'
        data-name={this.props.type}
        data-abbreviation={abbreviation}
      >
        {icon}
      </div>
    );
  }
}
// connect component to global state
MetaedgeChip = connect((state) => ({
  metagraph: state.metagraph
}))(MetaedgeChip);

// get html of metapath in form of visualization chips
export function metapathChips(edges) {
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

// get html of path in form of visualization chips
export function pathChips(path, expanded) {
  return path.map((entry, index) => {
    if (entry.element === 'node') {
      return (
        <NodeChip
          key={index}
          type={entry.type}
          name={entry.name}
          expanded={expanded}
        />
      );
    }
    if (entry.element === 'edge') {
      return (
        <MetaedgeChip
          key={index}
          type={entry.type}
          direction={entry.direction}
        />
      );
    }
    return '';
  });
}

// node "chip" component
export class NodeChip extends Component {
  // display component
  render() {
    let fillColor = '#424242';
    let textColor = '#fafafa';
    let style = {};
    if (this.props.hetioStyles)
      style = this.props.hetioStyles[this.props.type];
    if (style && style.fill_color)
      fillColor = style.fill_color;
    if (style && style.text_color)
      textColor = style.text_color;

    return (
      <span
        className='node_chip'
        style={{ background: fillColor, color: textColor }}
        data-expanded={this.props.expanded}
      >
        {this.props.name}
      </span>
    );
  }
}
// connect component to global state
NodeChip = connect((state) => ({
  hetioStyles: state.hetioStyles
}))(NodeChip);
