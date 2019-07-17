import React from 'react';
import { Component } from 'react';

import { CollapsibleSection } from '../components/collapsible-section.js';

import { GraphAttic } from './graph-attic.js';
import { Graph } from './graph.js';
import { SelectedInfo } from './selected-info.js';

// path graph section component
export class PathGraph extends Component {
  // display component
  render() {
    return (
      <CollapsibleSection
        label='Path Graph'
        tooltipText='Graph visualization of path results'
      >
        <GraphAttic />
        <Graph />
        <SelectedInfo />
      </CollapsibleSection>
    );
  }
}
