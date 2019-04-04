import React from 'react';
import { Component } from 'react';

import { Metatypes } from './metatypes.js';
import './metanode-chip.css';

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
    const node = Metatypes.lookup(this.props.type);

    // get icon
    let icon;
    switch (node.name) {
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
    }

    return <div className='metanode_chip'>{icon}</div>;
  }
}

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

    const node = Metatypes.lookup(this.props.type);
    return (
      <div
        className='metaedge_chip'
        data-name={node.name}
        data-abbreviation={node.abbreviation}
      >
        {icon}
      </div>
    );
  }
}
