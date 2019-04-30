import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import './chips.css';

import { ReactComponent as ArrowBoth } from './arrow-icon-both.svg';
import { ReactComponent as ArrowForward } from './arrow-icon-forward.svg';
import { ReactComponent as ArrowBackward } from './arrow-icon-backward.svg';

import { ReactComponent as Gene } from './chip-gene.svg';
import { ReactComponent as Compound } from './chip-compound.svg';
import { ReactComponent as Anatomy } from './chip-anatomy.svg';
import { ReactComponent as Disease } from './chip-disease.svg';
import { ReactComponent as Symptom } from './chip-symptom.svg';
import { ReactComponent as SideEffect } from './chip-side-effect.svg';
import { ReactComponent as BiologicalProcess } from './chip-biological-process.svg';
import { ReactComponent as CellularComponent } from './chip-cellular-component.svg';
import { ReactComponent as MolecularFunction } from './chip-molecular-function.svg';
import { ReactComponent as Pathway } from './chip-pathway.svg';
import { ReactComponent as PharmacologicClass } from './chip-pharmacologic-class.svg';

// metanode 'chip' component
// colored circle with abbreviation text in middle
// eg (G) for 'gene'
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
    const style = this.props.hetioStyles[this.props.type];
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

// metaedge 'chip' component
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
    if (this.props.metagraph.kind_to_abbrev)
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

