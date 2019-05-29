import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { CollapsibleSection } from './collapsible-section.js';
import { NumberBox } from './number-box.js';
import { TextButton } from './buttons.js';
import { downloadSvg } from './util.js';
import { transferObjectProps } from './util.js';
import { Tooltip } from './tooltip.js';
import { sortCustom } from './util.js';
import { cutString } from './util.js';
import './path-graph.css';

// graph settings
const minWidth = 240;
const minHeight = 240;
const maxWidth = 3840;
const maxHeight = 2160;
const minZoom = 0.25;
const maxZoom = 4;
const nodeRadius = 25;
const nodeDistance = 100;
const nodeCharLimit = 25;
const nodeFontSize = 8;
const nodeRepulsion = 200;
const edgeFontSize = 8;
const edgeThickness = 2;
const edgeArrowSize = 10;
const edgeSpreadDistance = 20;
const edgeSpreadAngle = (45 / 360) * 2 * Math.PI;
const inkColor = '#424242';
const backgroundColor = '#fafafa';
const highlightColor = '#ffcc00';

// path graph section component
export class PathGraph extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.width = maxWidth;
    this.state.height = maxHeight;
    this.state.nodeCount = 0;
    this.state.edgeCount = 0;
    this.state.selectedElement = null;
    this.state.hoveredElement = null;

    this.graph = React.createRef();

    this.expandContainer = this.expandContainer.bind(this);
    this.collapseContainer = this.collapseContainer.bind(this);
    this.updateSectionWidth = this.updateSectionWidth.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.fitView = this.fitView.bind(this);
    this.setGraphCounts = this.setGraphCounts.bind(this);
    this.setSelectedElement = this.setSelectedElement.bind(this);
    this.setHoveredElement = this.setHoveredElement.bind(this);
  }

  // when component mounts
  componentDidMount() {
    this.updateSectionWidth();
    this.collapseContainer(true);
    window.addEventListener('resize', this.updateSectionWidth);
  }

  // when component updates
  componentDidUpdate(prevProps, prevState) {
    if (this.state.width !== prevState.width) {
      let width = this.state.width;
      if (Math.round(width) !== width)
        width = Math.round(width);
      if (width > maxWidth)
        width = maxWidth;
      if (width < minWidth)
        width = minWidth;
      this.setState({ width: width });
    }
    if (this.state.height !== prevState.height) {
      let height = this.state.height;
      if (Math.round(height) !== height)
        height = Math.round(height);
      if (height > maxHeight)
        height = maxHeight;
      if (height < minHeight)
        height = minHeight;
      this.setState({ height: height });
    }
  }

  // get current width of <section> element
  updateSectionWidth() {
    this.setState({ sectionWidth: ReactDOM.findDOMNode(this).clientWidth });
  }

  // expand graph container to width of window
  expandContainer(proportionalHeight) {
    const newState = {};
    newState.width = document.body.clientWidth - 20 - 20;
    if (proportionalHeight)
      newState.height = (newState.width * 3) / 4;
    this.setState(newState, this.fitView);
  }

  // collapse graph container to width of <section> element
  collapseContainer(proportionalHeight) {
    const newState = {};
    newState.width = ReactDOM.findDOMNode(this).clientWidth;
    if (proportionalHeight)
      newState.height = (newState.width * 3) / 4;
    this.setState(newState, this.fitView);
  }

  // set width of graph container
  setWidth(value) {
    this.setState({ width: value });
  }

  // set height of graph container
  setHeight(value) {
    this.setState({ height: value });
  }

  // fit view to contents of graph
  fitView() {
    if (this.graph.current)
      this.graph.current.fitView();
  }

  // download graph as svg
  downloadSvg() {
    const svg = document.getElementById('graph');
    downloadSvg(svg);
  }

  // set counts of nodes, edges, etc
  setGraphCounts(nodeCount, edgeCount) {
    this.setState({
      nodeCount: nodeCount,
      edgeCount: edgeCount
    });
  }

  // sets the selected node/edge
  setSelectedElement(element) {
    this.setState({ selectedElement: element });
  }

  // sets the hovered node/edge
  setHoveredElement(element) {
    this.setState({ hoveredElement: element });
  }

  // display component
  render() {
    const element = this.state.hoveredElement || this.state.selectedElement;
    let info = '';
    if (element) {
      if (element.elementType === 'node') {
        info = (
          <SelectedInfo
            node={element}
            primaryFields={['metanode', 'neo4j_id']}
            order={[
              'name',
              'metanode',
              'source',
              'url',
              'description',
              'identifier',
              'neo4j_id'
            ]}
          />
        );
      }
      if (element.elementType === 'edge') {
        info = (
          <SelectedInfo
            edge={element}
            primaryFields={['kind', 'directed', 'neo4j_id']}
            order={['kind', 'neo4j_id', 'source']}
          />
        );
      }
    }
    return (
      <section>
        <CollapsibleSection
          label='Path Graph'
          tooltipText='Graph of path results'
        >
          <div className='table_attic'>
            <TextButton
              text='reset'
              icon={faPowerOff}
              onClick={() => {
                if (this.graph.current)
                  this.graph.current.restartGraph();
              }}
              tooltipText='Completely restart graph'
            />
            <TextButton
              text='unpin all'
              icon={faMapMarkerAlt}
              onClick={() => {
                if (this.graph.current)
                  this.graph.current.unpinAll();
              }}
              tooltipText='Unpin all nodes'
            />
            <TextButton
              text='pin all'
              icon={faMapMarker}
              onClick={() => {
                if (this.graph.current)
                  this.graph.current.pinAll();
              }}
              tooltipText='Pin all nodes in their current position'
            />
            <TextButton
              text='fit'
              icon={faExpand}
              onClick={this.fitView}
              tooltipText='Fit the view to the contents of the graph'
            />
            <TextButton
              text='.svg'
              icon={faDownload}
              onClick={this.downloadSvg}
              tooltipText='Download the graph as an .svg file'
            />
            <NumberBox
              tooltipText='Width of the container'
              min={minWidth}
              step='5'
              max={maxWidth}
              value={this.state.width}
              onArrows={this.setWidth}
              onSubmit={this.setWidth}
            />
            &times;
            <NumberBox
              tooltipText='Height of the container'
              min={minHeight}
              step='5'
              max={maxHeight}
              value={this.state.height}
              onArrows={this.setHeight}
              onSubmit={this.setHeight}
            />
            <TextButton
              className='graph_expand_collapse_button'
              text=''
              icon={faExpandArrowsAlt}
              onClick={this.expandContainer}
              tooltipText='Fit the graph to the window'
            />
            <TextButton
              className='graph_expand_collapse_button'
              text=''
              icon={faCompressArrowsAlt}
              onClick={this.collapseContainer}
              tooltipText='Fit the graph to the "Path Graph" section'
            />
            <span className='small light right'>
              {this.state.nodeCount} nodes, {this.state.edgeCount} edges
            </span>
          </div>
          <Graph
            ref={this.graph}
            width={this.state.width}
            height={this.state.height}
            sectionWidth={this.state.sectionWidth}
            setGraphCounts={this.setGraphCounts}
            setSelectedElement={this.setSelectedElement}
            setHoveredElement={this.setHoveredElement}
          />
          <div id='graph_info_container'>{info}</div>
        </CollapsibleSection>
      </section>
    );
  }
}

// path graph component
export class Graph extends Component {
  // initialize component
  constructor() {
    super();

    this.state = {};
    this.state.data = this.assembleGraph(null);

    this.fitView = this.fitView.bind(this);
    this.resetView = this.resetView.bind(this);
    this.onSimulationTick = this.onSimulationTick.bind(this);
    this.onNodeEdgeClick = this.onNodeEdgeClick.bind(this);
    this.onNodeEdgeHover = this.onNodeEdgeHover.bind(this);
    this.onNodeEdgeUnhover = this.onNodeEdgeUnhover.bind(this);
    this.onNodeDragStart = this.onNodeDragStart.bind(this);
    this.onNodeDragEnd = this.onNodeDragEnd.bind(this);
    this.onViewClick = this.onViewClick.bind(this);
  }

  // when component mounts
  componentDidMount() {
    this.createGraph();
    this.setState({ data: this.assembleGraph() });
  }

  // when component updates
  componentDidUpdate(prevProps, prevState) {
    // if path queries have changed
    if (this.props.pathQueries !== prevProps.pathQueries)
      // update graph data
      this.setState({ data: this.assembleGraph() });
    // if graph data has changed
    else if (this.state.data !== prevState.data) {
      // copy simulation vars from old data to new data to persist node
      // positions/velocities/etc
      transferObjectProps(
        prevState.data.nodes,
        this.state.data.nodes,
        ['neo4j_id'],
        ['x', 'y', 'fx', 'fy', 'vx', 'vy']
      );

      // update graph
      this.updateGraph();

      // update graph info (node count, edge count, etc)
      this.props.setGraphCounts(
        this.state.data.nodes.length,
        this.state.data.edges.length
      );
    }
  }

  // completely restart graph
  restartGraph() {
    this.resetView();
    this.state.simulation.alpha(1).restart();
    // set graph data to null then back to data again
    this.setState({ data: this.assembleGraph(null) }, () =>
      this.setState({ data: this.assembleGraph() })
    );
  }

  // create graph when page first loads
  createGraph() {
    const svg = d3.select('#graph');

    // create physics simulation for nodes to detangle and prettify layout
    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3
          .forceLink()
          .distance(nodeDistance)
          .id((d) => d.neo4j_id)
      )
      .force(
        'collide',
        d3
          .forceCollide()
          .radius(nodeRadius)
          .strength(1)
      )
      .force('charge', d3.forceManyBody().strength(-nodeRepulsion))
      .force('center', d3.forceCenter(0, 0));
    simulation.on('tick', this.onSimulationTick);

    // create handler for panning and zooming view
    const viewZoomHandler = d3
      .zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', this.onViewZoom);
    svg.call(viewZoomHandler);

    // handle clicks on background
    svg.on('click', this.onViewClick);

    // create handler for dragging nodes
    const nodeDragHandler = d3
      .drag()
      .on('drag', this.onNodeDrag)
      .on('start', this.onNodeDragStart)
      .on('end', this.onNodeDragEnd);

    // store the above objects to be referenced on graph updates
    this.setState(
      {
        simulation: simulation,
        viewZoomHandler: viewZoomHandler,
        nodeDragHandler: nodeDragHandler
      },
      this.resetView
    );
  }

  // when simulation ticks forward
  onSimulationTick() {
    // position all elements in graph
    d3.selectAll('.graph_edge_line_highlight').each(this.positionEdge);
    d3.selectAll('.graph_edge_line').each(this.positionEdge);
    d3.selectAll('.graph_edge_label').each(this.positionEdgeLabel);
    d3.selectAll('.graph_node_circle_highlight').each(this.positionNode);
    d3.selectAll('.graph_node_circle').each(this.positionNode);
    d3.selectAll('.graph_node_label').each(this.positionNode);
  }

  // position node based on results of simulation
  // d3 simulation stores positions/velocities/etc directly in data object
  positionNode(d, i, s) {
    const node = s[i];
    d3.select(node).attr('transform', 'translate(' + d.x + ',' + d.y + ')');
  }

  // position edge line between source/target node
  positionEdge(d, i, s) {
    let x1 = d.source.x;
    let y1 = d.source.y;
    let x2 = d.target.x;
    let y2 = d.target.y;
    let path = '';

    // get angle between source/target in radians
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // get radius of source/target nodes
    const sourceRadius = nodeRadius - 0.25;
    let targetRadius = nodeRadius - 0.25;
    // increase target node radius to bring tip of arrowhead out of circle
    if (d.directed)
      targetRadius += edgeArrowSize / 4;

    if (d.coincidentOffset === 0) {
      // if no coincident edges, or middle of odd number of coincident edges,
      // just draw straight line

      // bring start/end of line to edge of circles
      x1 += Math.cos(angle) * sourceRadius;
      y1 += Math.sin(angle) * sourceRadius;
      x2 -= Math.cos(angle) * targetRadius;
      y2 -= Math.sin(angle) * targetRadius;

      // straight line path
      path = ['M', x1, y1, 'L', x2, y2].join(' ');
    } else {
      // otherwise, if coincident edge, draw a curve

      // spread out contact points with circle over spread angle
      const angleOffset = edgeSpreadAngle * d.coincidentOffset;

      // bring start/end of curve to edge of circle
      x1 += Math.cos(angle + angleOffset) * sourceRadius;
      y1 += Math.sin(angle + angleOffset) * sourceRadius;
      x2 -= Math.cos(angle - angleOffset) * targetRadius;
      y2 -= Math.sin(angle - angleOffset) * targetRadius;

      // get straight line distance between start/end of curve
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

      // get "sagitta" distance
      const sag = Math.min(edgeSpreadDistance, distance) * d.coincidentOffset;

      // get point distance "sag" away from midpoint of line
      const qX = (x2 + x1) / 2 - (2 * sag * (y2 - y1)) / distance;
      const qY = (y2 + y1) / 2 + (2 * sag * (x2 - x1)) / distance;

      // draw curve with handle point Q
      path = ['M', x1, y1, 'Q', qX, qY, x2, y2].join(' ');
    }

    // set edge path
    const edge = s[i];
    d3.select(edge).attr('d', path);
  }

  // position edge label in center of edge line and rotate
  positionEdgeLabel(d, i, s) {
    let x1 = d.source.x;
    let y1 = d.source.y;
    let x2 = d.target.x;
    let y2 = d.target.y;

    // get angle between source/target in radians
    let angle = Math.atan2(y2 - y1, x2 - x1);

    // get radius of source/target nodes
    const sourceRadius = nodeRadius - 0.25;
    let targetRadius = nodeRadius - 0.25;
    // increase target node radius to bring tip of arrowhead out of circle
    if (d.directed)
      targetRadius += edgeArrowSize / 4;

    // spread out contact points with circle over spread angle
    const angleOffset = edgeSpreadAngle * d.coincidentOffset;

    // bring start/end of curve to edge of circle
    x1 += Math.cos(angle + angleOffset) * sourceRadius;
    y1 += Math.sin(angle + angleOffset) * sourceRadius;
    x2 -= Math.cos(angle - angleOffset) * targetRadius;
    y2 -= Math.sin(angle - angleOffset) * targetRadius;

    // get straight line distance between start/end of curve
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // get "sagitta" distance
    const sag = Math.min(edgeSpreadDistance, distance) * d.coincidentOffset;

    // get anchor point of text, point distance "sag" away from midpoint of line
    const textX = (x2 + x1) / 2 - (sag * (y2 - y1)) / distance;
    const textY = (y2 + y1) / 2 + (sag * (x2 - x1)) / distance;

    // get angle of text in degrees
    angle = (angle / (2 * Math.PI)) * 360;
    // rotate text to always show upright
    if (angle > 90)
      angle -= 180;
    if (angle <= -90)
      angle += 180;

    // set vertical alignment of text relative to anchor point
    let dy = -0.35 * edgeFontSize;
    // always place text on "outside" side of curve
    if (sag < 0 && d.source.x > d.target.x)
      dy = 1.1 * edgeFontSize;

    // set edge text transform
    const edgeLabel = s[i];
    d3.select(edgeLabel)
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', dy)
      .attr(
        'transform',
        'translate(' + textX + ',' + textY + ') rotate(' + angle + ') '
      );
  }

  // fit view to contents of graph
  fitView() {
    const contents = d3
      .select('#graph_view')
      .node()
      .getBBox();
    const container = d3
      .select('#graph')
      .node()
      .getBoundingClientRect();
    const padding = nodeRadius;

    // if no contents, exit
    if (contents.width === 0 || contents.height === 0)
      return;

    // dimensions minus borders
    container.width -= 2;
    container.height -= 2;

    // calculate center of contents
    contents.midX = contents.x + contents.width / 2;
    contents.midY = contents.y + contents.height / 2;

    // determine scale and translate to fit view
    const scale =
      1 /
      Math.max(
        contents.width / (container.width - padding),
        contents.height / (container.height - padding)
      );
    const translateX = container.width / 2 - scale * contents.midX;
    const translateY = container.height / 2 - scale * contents.midY;

    // perform view transform
    d3.select('#graph').call(
      this.state.viewZoomHandler.transform,
      d3.zoomIdentity.translate(translateX, translateY).scale(scale)
    );
  }

  // center view and reset to 100% zoom
  resetView() {
    const container = d3
      .select('#graph')
      .node()
      .getBoundingClientRect();

    // dimensions minus borders
    container.width -= 2;
    container.height -= 2;

    // determine scale and translate to fit view
    const scale = 1;
    const translateX = container.width / 2;
    const translateY = container.height / 2;

    // perform view transform
    d3.select('#graph').call(
      this.state.viewZoomHandler.transform,
      d3.zoomIdentity.translate(translateX, translateY).scale(scale)
    );
  }

  // unpin all nodes
  unpinAll() {
    const data = this.state.data;

    data.nodes.forEach((node) => {
      node.fx = null;
      node.fy = null;
    });

    this.state.simulation.alpha(1).restart();
  }

  // pin all nodes
  pinAll() {
    const data = this.state.data;

    data.nodes.forEach((node) => {
      node.fx = node.x;
      node.fy = node.y;
    });
  }

  // when node or edge clicked by user
  onNodeEdgeClick(d) {
    d3.event.stopPropagation();

    if (!d.selected) {
      this.deselectAll();
      d.selected = true;
    } else
      this.deselectAll();

    this.updateNodeCircles();
    this.updateEdgeLines();

    this.props.setSelectedElement(d);
  }

  // when node or edge hovered by user
  onNodeEdgeHover(d) {
    d3.event.stopPropagation();

    d.hovered = true;

    this.updateNodeCircles();
    this.updateEdgeLines();

    this.props.setHoveredElement(d);
  }

  // when node or edge unhovered by user
  onNodeEdgeUnhover(d) {
    d3.event.stopPropagation();

    d.hovered = false;

    this.updateNodeCircles();
    this.updateEdgeLines();

    this.props.setHoveredElement(null);
  }

  // deselect all elements
  deselectAll() {
    for (const node of this.state.data.nodes)
      node.selected = undefined;
    for (const edge of this.state.data.edges)
      edge.selected = undefined;
  }

  // when node dragged by user
  onNodeDragStart() {
    this.state.simulation.alphaTarget(1).restart();
  }

  // when node dragged by user
  onNodeDrag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  // when node dragged by user
  onNodeDragEnd() {
    this.state.simulation.alphaTarget(0).restart();
  }

  // when view/background is clicked by user
  onViewClick() {
    this.deselectAll();
    this.updateNodeCircles();
    this.updateEdgeLines();
    this.props.setSelectedElement(null);
  }

  // when view panned or zoomed by user
  onViewZoom() {
    d3.select('#graph_view').attr('transform', d3.event.transform);
  }

  // update simulation with new data (new nodes and/or edges)
  updateSimulation() {
    const data = this.state.data;
    this.state.simulation.nodes(data.nodes);
    this.state.simulation.force('link').links(data.edges);
    this.state.simulation.alpha(1).restart();
  }

  // draw edge line highlight elements
  updateEdgeLineHighlights() {
    const data = this.state.data;
    const layer = d3.select('#graph_edge_line_highlight_layer');

    const edgeLineHighlights = layer
      .selectAll('.graph_edge_line_highlight')
      .data(data.edges.filter((d) => d.highlighted === true));

    edgeLineHighlights
      .enter()
      .append('path')
      .merge(edgeLineHighlights)
      .attr('class', 'graph_edge_line_highlight')
      .attr('fill', 'none')
      .attr('stroke', highlightColor)
      .attr('stroke-width', edgeArrowSize)
      .attr('stroke-linecap', 'square');

    edgeLineHighlights.exit().remove();
  }

  // draw edge line elements
  updateEdgeLines() {
    const data = this.state.data;
    const layer = d3.select('#graph_edge_line_layer');

    const edgeLines = layer.selectAll('.graph_edge_line').data(data.edges);

    edgeLines
      .enter()
      .append('path')
      .merge(edgeLines)
      .attr('class', 'graph_edge_line')
      .attr('marker-end', (d) => (d.directed ? 'url(#graph_arrowhead)' : ''))
      .attr('fill', 'none')
      .attr('stroke', inkColor)
      .attr('stroke-width', edgeThickness)
      .style('stroke-dasharray', (d) =>
        d.selected || d.hovered
          ? edgeThickness * 2 + ' ' + edgeThickness
          : 'none'
      );

    edgeLines.exit().remove();
  }

  // draw edge label elements
  updateEdgeLabels() {
    const data = this.state.data;
    const layer = d3.select('#graph_edge_label_layer');

    const edgeLabels = layer.selectAll('.graph_edge_label').data(data.edges);

    edgeLabels
      .enter()
      .append('text')
      .on('click', this.onNodeEdgeClick)
      .on('mouseenter', this.onNodeEdgeHover)
      .on('mouseleave', this.onNodeEdgeUnhover)
      .merge(edgeLabels)
      .attr('class', 'graph_edge_label')
      .attr('font-size', edgeFontSize)
      .attr('font-weight', 500)
      .attr('text-anchor', 'middle')
      .attr('user-select', 'none')
      .attr('fill', inkColor)
      .style('cursor', 'pointer')
      .text((d) => d.kind);

    edgeLabels.exit().remove();
  }

  // draw node circle highlight elements
  updateNodeCircleHighlights() {
    const data = this.state.data;
    const layer = d3.select('#graph_node_circle_highlight_layer');

    const nodeCircleHighlights = layer
      .selectAll('.graph_node_circle_highlight')
      .data(data.nodes.filter((d) => d.highlighted === true));

    nodeCircleHighlights
      .enter()
      .append('circle')
      .merge(nodeCircleHighlights)
      .attr('class', 'graph_node_circle_highlight')
      .attr('r', nodeRadius)
      .attr('fill', 'none')
      .attr('stroke', highlightColor)
      .attr('stroke-width', edgeArrowSize);

    nodeCircleHighlights.exit().remove();
  }

  // draw node circle elements
  updateNodeCircles() {
    const data = this.state.data;
    const layer = d3.select('#graph_node_circle_layer');

    const nodeCircles = layer.selectAll('.graph_node_circle').data(data.nodes);

    nodeCircles
      .enter()
      .append('circle')
      .call(this.state.nodeDragHandler)
      .on('click', this.onNodeEdgeClick)
      .on('mouseenter', this.onNodeEdgeHover)
      .on('mouseleave', this.onNodeEdgeUnhover)
      .merge(nodeCircles)
      .attr('class', 'graph_node_circle')
      .attr('r', nodeRadius)
      .attr('fill', (d) => this.getNodeFillColor(d.metanode))
      .attr('stroke', (d) => (d.selected || d.hovered ? inkColor : 'none'))
      .attr('stroke-width', edgeThickness)
      .style('stroke-dasharray', edgeThickness * 2 + ' ' + edgeThickness)
      .style('cursor', 'pointer');

    nodeCircles.exit().remove();
  }

  // draw node label elements
  updateNodeLabels() {
    const data = this.state.data;
    const layer = d3.select('#graph_node_label_layer');

    const nodeLabels = layer.selectAll('.graph_node_label').data(data.nodes);

    nodeLabels
      .enter()
      .append('foreignObject')
      .attr('class', 'graph_node_label')
      .append('xhtml:div')
      .append('xhtml:span');

    layer
      .selectAll('.graph_node_label')
      .attr('x', -nodeRadius)
      .attr('y', -nodeRadius)
      .attr('width', nodeRadius * 2)
      .attr('height', nodeRadius * 2)
      .style('pointer-events', 'none')
      .select('div')
      .style('display', 'flex')
      .style('justify-content', 'center')
      .style('align-items', 'center')
      .style('width', '100%')
      .style('height', '100%')
      .style('box-sizing', 'border-box')
      .style('padding', nodeRadius * 0.25 + 'px')
      .select('span')
      .style('text-align', 'center')
      .style('font-size', nodeFontSize + 'px')
      .style('font-weight', 500)
      .style('color', (d) => this.getNodeTextColor(d.metanode))
      .style('word-break', 'break-word')
      .html((d) => cutString(d.properties.name, nodeCharLimit));

    nodeLabels.exit().remove();
  }

  // update graph
  updateGraph() {
    this.updateEdgeLineHighlights();
    this.updateEdgeLines();
    this.updateEdgeLabels();
    this.updateNodeCircleHighlights();
    this.updateNodeCircles();
    this.updateNodeLabels();
    this.pinSourceAndTargetNodes();
    this.updateSimulation();
  }

  // fix source and target nodes in nice starting positions
  pinSourceAndTargetNodes() {
    const data = this.state.data;

    data.nodes.forEach((node) => {
      if (node.neo4j_id === data.source_neo4j_id) {
        if (!node.x && !node.fx)
          node.fx = -nodeDistance * 2;
        if (!node.y && !node.fy)
          node.fy = 0;
      }
      if (node.neo4j_id === data.target_neo4j_id) {
        if (!node.x && !node.fx)
          node.fx = nodeDistance * 2;
        if (!node.y && !node.fy)
          node.fy = 0;
      }
    });
  }

  // get node fill color based on type (metanode)
  getNodeFillColor(type) {
    const style = this.props.hetioStyles[type];
    if (style && style.fill_color)
      return style.fill_color;
    else
      return inkColor;
  }

  // get node text color based on type (metanode)
  getNodeTextColor(type) {
    const style = this.props.hetioStyles[type];
    if (style && style.text_color)
      return style.text_color;
    else
      return backgroundColor;
  }

  // construct graph object with relevant properties for each node/edge
  assembleGraph(pathQueries) {
    // empty graph object
    const graph = {
      source_neo4j_id: null,
      target_neo4j_id: null,
      nodes: [],
      edges: []
    };

    // if null explicitly provided as argument, return empty graph object
    if (pathQueries === null)
      return graph;

    // if pathQueries not provided as argument, get from component props
    if (!pathQueries)
      pathQueries = this.props.pathQueries;

    // if pathQueries not valid, exit
    if (!pathQueries || pathQueries.length <= 0)
      return graph;

    // get source/target nodes from first path in pathQueries
    const firstPath = pathQueries[0].paths[0];
    graph.source_neo4j_id = firstPath.node_ids[0];
    graph.target_neo4j_id = firstPath.node_ids[firstPath.node_ids.length - 1];

    // loop through all paths in pathQueries
    for (const pathQuery of pathQueries) {
      for (const path of pathQuery.paths) {
        // if not checked, don't include in graph
        if (!path.checked)
          continue;

        // loop through nodes in path
        for (const nodeId of path.node_ids) {
          const node = pathQuery.nodes[nodeId];
          const existingNode = graph.nodes.find(
            (existing) => existing.neo4j_id === node.neo4j_id
          );
          if (!existingNode) {
            // if node hasn't been added to graph yet, add it
            graph.nodes.push({
              // copy all properties of node
              ...node,
              // add highlight property
              highlighted: path.highlighted,
              // mark as node
              elementType: 'node'
            });
          } else if (path.highlighted)
            // if node already in graph, still update highlight status
            existingNode.highlighted = true;
        }

        // loop through edges in path
        for (const relId of path.rel_ids) {
          const edge = pathQuery.relationships[relId];
          const existingEdge = graph.edges.find(
            (existing) =>
              existing.source_neo4j_id === edge.source_neo4j_id &&
              existing.target_neo4j_id === edge.target_neo4j_id &&
              existing.kind === edge.kind &&
              existing.directed === edge.directed
          );
          if (!existingEdge) {
            // if edge hasn't been added to graph yet, add it
            graph.edges.push({
              // copy all properties of edge
              ...edge,
              // set duplicate properties "source" and "target" because d3
              // needs them (with those names) to create links between nodes
              source: edge.source_neo4j_id,
              target: edge.target_neo4j_id,
              // add highlight property
              highlighted: path.highlighted,
              // mark as edge
              elementType: 'edge'
            });
          } else if (path.highlighted)
            // if edge already in graph, still update highlight status
            existingEdge.highlighted = true;
        }
      }
    }

    // loop through all edges in graph to find coincident edges
    // (multiple edges connecting the same two nodes)

    // sort all edges in graph into bins of same source/target nodes
    const edgeBins = [];
    for (const edgeA of graph.edges) {
      let matched = false;
      // find bin with edges that have same source/target nodes
      // (order-insensitve)
      for (const edgeBin of edgeBins) {
        const match = edgeBin.find(
          (edgeB) =>
            (edgeA.source_neo4j_id === edgeB.source_neo4j_id &&
              edgeA.target_neo4j_id === edgeB.target_neo4j_id) ||
            (edgeA.source_neo4j_id === edgeB.target_neo4j_id &&
              edgeA.target_neo4j_id === edgeB.source_neo4j_id)
        );
        // if matching bin found, add edge to it
        if (match) {
          edgeBin.push(edgeA);
          matched = true;
          break;
        }
      }
      // if didn't find matching bin, create new one and add edge to it
      if (!matched)
        edgeBins.push([edgeA]);
    }

    // loop through edge bins
    for (const edgeBin of edgeBins) {
      // for each edge in bin, assign coincident "offset", a value between
      // -1 and 1 used for drawing, where 0 is straight line, negative is curve
      // on one side, and positive is curve on other side
      const firstSource = edgeBin[0].source_neo4j_id;
      for (let index = 0; index < edgeBin.length; index++) {
        // default offset to 0
        let offset = 0;
        if (edgeBin.length > 1)
          offset = -0.5 + index / (edgeBin.length - 1);
        // if edge source/target order in reverse order as rest of bin,
        // invert offset
        if (edgeBin[index].source_neo4j_id !== firstSource)
          offset *= -1;
        edgeBin[index].coincidentOffset = offset;
      }
    }

    // put source and target node at end of list to ensure highest z-index
    const sourceNodeIndex = graph.nodes.findIndex(
      (node) => node.neo4j_id === graph.source_neo4j_id
    );
    if (sourceNodeIndex !== -1)
      graph.nodes.push(graph.nodes.splice(sourceNodeIndex, 1)[0]);
    const targetNodeIndex = graph.nodes.findIndex(
      (node) => node.neo4j_id === graph.target_neo4j_id
    );
    if (targetNodeIndex !== -1)
      graph.nodes.push(graph.nodes.splice(targetNodeIndex, 1)[0]);

    return graph;
  }

  // display component
  render() {
    // calculate x position of graph container
    let left = 0;
    if (this.props.sectionWidth && this.props.width) {
      left = this.props.sectionWidth / 2 - this.props.width / 2;
      const minLeft =
        this.props.sectionWidth / 2 - document.body.clientWidth / 2 + 20;
      if (left < minLeft)
        left = minLeft;
    }

    // title text
    const title =
      (this.props.sourceNode.name || '___') +
      ' → ' +
      (this.props.targetNode.name || '___');

    // description text
    const description = [
      'Graph visualization of the connectivity between ',
      this.props.sourceNode.name || '___',
      ' (',
      this.props.sourceNode.metanode || '___',
      ') and ',
      this.props.targetNode.name || '___',
      ' (',
      this.props.targetNode.metanode || '___',
      '). ',
      '\n\n',
      'Created at ',
      window.location.href,
      '\n\n',
      'This subgraph of Hetionet v1.0 was created from paths between the ',
      'specified source/target nodes that occurred more than expected ',
      'by chance. ',
      'See https://het.io for more information. '
    ].join('');

    return (
      <div id='graph_container' style={{ height: this.props.height }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          id='graph'
          width={this.props.width}
          height={this.props.height}
          style={{ left: left }}
        >
          <title>{title}</title>
          <desc>{description}</desc>
          <defs>
            <style>
              {`
                @import url('https://fonts.googleapis.com/css?family=Raleway:400,500,700');
                @import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,700&text=0123456789');
                * {
                  font-family: 'Montserrat', 'Raleway', sans-serif;
                }
              `}
            </style>
            <marker
              id='graph_arrowhead'
              viewBox='0 0 100 100'
              refX='80'
              refY='50'
              orient='auto'
              markerUnits='userSpaceOnUse'
              markerWidth={edgeArrowSize}
              markerHeight={edgeArrowSize}
            >
              <path
                d='
                  M 0 0
                  L 100 50
                  L 0 100'
                fill={inkColor}
              />
            </marker>
          </defs>
          <g id='graph_view'>
            <g id='graph_edge_line_highlight_layer' />
            <g id='graph_node_circle_highlight_layer' />
            <g id='graph_edge_line_layer' />
            <g id='graph_edge_label_layer' />
            <g id='graph_node_circle_layer' />
            <g id='graph_node_label_layer' />
          </g>
        </svg>
      </div>
    );
  }
}
// connect component to global state
Graph = connect(
  (state) => ({
    sourceNode: state.sourceNode,
    targetNode: state.targetNode,
    pathQueries: state.pathQueries,
    hetioStyles: state.hetioStyles
  }),
  null,
  null,
  { forwardRef: true }
)(Graph);

// selected node/edge info component
class SelectedInfo extends Component {
  // display row entries
  rows() {
    // helper text when user hovers over given field
    let tooltipText = {};
    if (this.props.hetioDefinitions.properties) {
      tooltipText = {
        ...tooltipText,
        ...this.props.hetioDefinitions.properties.common,
        ...this.props.hetioDefinitions.properties.edges
      };
    }
    tooltipText = { ...tooltipText, ...this.props.hetmechDefinitions };
    if (tooltipText['id'])
      tooltipText['neo4j_id'] = tooltipText['id'];

    const element = this.props.node || this.props.edge;

    // get primary fields from top level of node/edge
    let primaryFields = this.props.primaryFields;
    // get first/second column text (key/value) for each field
    primaryFields = primaryFields.map((field) => ({
      firstCol: field,
      secondCol: String(element[field]),
      tooltipText: tooltipText[field]
    }));

    // get 'extra fields' from node/edge 'properties' field
    let extraFields = Object.keys(element.properties);
    // get first/second column text (key/value) for each field
    extraFields = extraFields.map((field) => ({
      firstCol: field,
      secondCol: String(element.properties[field]),
      tooltipText: tooltipText[field]
    }));

    // combine primary and extra fields
    let fields = primaryFields.concat(extraFields);

    // display fields in custom order
    fields = sortCustom(fields, this.props.order, 'firstCol');

    // make columns from fields
    const cols = fields.map((field, index) => {
      return (
        <React.Fragment key={index}>
          <td className='col_m small light'>
            <Tooltip text={field.tooltipText}>{field.firstCol}</Tooltip>
          </td>
          <td className='small'>{field.secondCol}</td>
        </React.Fragment>
      );
    });

    // make rows in groups of two
    const rows = new Array(Math.ceil(cols.length / 2))
      .fill()
      .map(() => cols.splice(0, 2))
      .map((col, index) => <tr key={index}>{col}</tr>);

    return rows;
  }

  // display component
  render() {
    return (
      <table id='graph_info_table'>
        <tbody>{this.rows()}</tbody>
      </table>
    );
  }
}
// connect component to global state
SelectedInfo = connect((state) => ({
  hetioDefinitions: state.hetioDefinitions,
  hetmechDefinitions: state.hetmechDefinitions
}))(SelectedInfo);
