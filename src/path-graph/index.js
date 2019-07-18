import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';

import { CollapsibleSection } from '../components/collapsible-section.js';
import { GraphAttic } from './attic.js';
import { Graph } from './graph.js';
import { SelectedInfo } from './selected-info.js';

import { minWidth, minHeight, maxWidth, maxHeight } from './constants.js';

// path graph section component
export class PathGraph extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.width = 640;
    this.state.height = 480;
    this.state.sectionWidth = 640;
    this.state.selectedElement = null;
    this.state.hoveredElement = null;

    this.graphRef = React.createRef();
  }

  // when component mounts
  componentDidMount() {
    this.updateSectionWidth();
    this.collapseContainer(true);
    window.addEventListener('resize', this.updateSectionWidth);
  }

  // when component updates
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.width !== prevState.width ||
      this.state.height !== prevState.height
    ) {
      if (this.graphRef.current)
        this.graphRef.current.fitView();
    }
  }

  // set width of graph container
  setWidth = (width) => {
    if (Math.round(width) !== width)
      width = Math.round(width);
    if (width > maxWidth)
      width = maxWidth;
    if (width < minWidth)
      width = minWidth;
    this.setState({ width: width });
  };

  // set height of graph container
  setHeight = (height) => {
    if (Math.round(height) !== height)
      height = Math.round(height);
    if (height > maxHeight)
      height = maxHeight;
    if (height < minHeight)
      height = minHeight;
    this.setState({ height: height });
  };

  // expand graph container to width of window
  expandContainer = (proportionalHeight) => {
    const newState = {};
    newState.width = document.body.clientWidth - 20 - 20;
    if (proportionalHeight)
      newState.height = (newState.width * 3) / 4;
    this.setState(newState);
  };

  // collapse graph container to width of <section> element
  collapseContainer = (proportionalHeight) => {
    const newState = {};
    newState.width = ReactDOM.findDOMNode(this).clientWidth;
    if (proportionalHeight)
      newState.height = (newState.width * 3) / 4;
    this.setState(newState);
  };

  // get current width of <section> element
  updateSectionWidth = () => {
    this.setState({ sectionWidth: ReactDOM.findDOMNode(this).clientWidth });
  };

  //
  setSelectedElement = (element) => {
    this.setState({ selectedElement: element });
  };

  //
  setHoveredElement = (element) => {
    this.setState({ hoveredElement: element });
  };

  // display component
  render() {
    return (
      <CollapsibleSection
        label='Graph'
        tooltipText='Graph visualization of path results'
      >
        <GraphAttic
          graphRef={this.graphRef}
          width={this.state.width}
          height={this.state.height}
          setWidth={this.setWidth}
          setHeight={this.setHeight}
          collapseContainer={this.collapseContainer}
          expandContainer={this.expandContainer}
        />
        <Graph
          ref={this.graphRef}
          width={this.state.width}
          height={this.state.height}
          sectionWidth={this.state.sectionWidth}
          setSelectedElement={this.setSelectedElement}
          setHoveredElement={this.setHoveredElement}
          selectedElement={this.state.selectedElement}
          hoveredElement={this.state.hoveredElement}
        />
        <SelectedInfo
          selectedElement={this.state.selectedElement}
          hoveredElement={this.state.hoveredElement}
        />
      </CollapsibleSection>
    );
  }
}
