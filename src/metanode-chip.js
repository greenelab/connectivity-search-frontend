import React from 'react';
import { Component } from 'react';

import { Metatypes } from './metatypes.js';
import './metanode-chip.css';
import { ReactComponent as IconArrowBoth } from './arrow-icon-both.svg';
import { ReactComponent as IconArrowForward } from './arrow-icon-forward.svg';
import { ReactComponent as IconArrowBackward } from './arrow-icon-backward.svg';

// metanode 'chip' component
// colored circle with abbreviation text in middle
// eg (G) for 'gene'
export class MetanodeChip extends Component {
  // display component
  render() {
    const node = Metatypes.lookup(this.props.type);
    return (
      <div
        className={
          'metanode_chip ' + (node.abbreviation.length > 1 ? 'small' : '')
        }
        data-name={node.name}
        data-abbreviation={node.abbreviation}
        style={{ backgroundColor: node.backgroundColor, color: node.textColor }}
      />
    );
  }
}

// metaedge 'chip' component
// svg arrow with abbreviation text above
export class MetaedgeChip extends Component {
  // display component
  render() {
    // get edge direction icon
    let directionIcon;
    switch (this.props.direction) {
      case 'backward':
        directionIcon = <IconArrowBackward />;
        break;
      case 'forward':
        directionIcon = <IconArrowForward />;
        break;
      default:
        directionIcon = <IconArrowBoth />;
        break;
    }

    const node = Metatypes.lookup(this.props.type);
    return (
      <div
        className={
          'metaedge_chip ' + (node.abbreviation.length > 1 ? 'small' : '')
        }
        data-name={node.name}
        data-abbreviation={node.abbreviation}
      >
        {directionIcon}
      </div>
    );
  }
}
