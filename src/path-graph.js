import React from 'react';
import { Component } from 'react';

import { CollapsibleSection } from './collapsible-section.js';
import './path-graph.css';

// import * as d3 from 'd3';

// path graph section component
export class PathGraph extends Component {
  componentDidMount() {}
  // display component
  render() {
    return (
      <section>
        <CollapsibleSection
          label='Path Graph'
          tooltipText='Graph of path results'
        >
          <svg id='graph_container' />
        </CollapsibleSection>
      </section>
    );
  }
}
