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
import { TextButton } from './buttons.js';
import { downloadSvg } from './util.js';
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
const inkColor = '#424242';
const backgroundColor = '#fafafa';
const highlightColor = '#02b3e4';

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

    this.graph = React.createRef();

    this.expandContainer = this.expandContainer.bind(this);
    this.collapseContainer = this.collapseContainer.bind(this);
    this.updateSectionWidth = this.updateSectionWidth.bind(this);
    this.setDimensions = this.setDimensions.bind(this);
    this.setGraphCounts = this.setGraphCounts.bind(this);
  }

  // when component mounts
  componentDidMount() {
    this.updateSectionWidth();
    this.collapseContainer();
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
  expandContainer() {
    const width = window.innerWidth - 20 - 20;
    const height = (width * 3) / 4;
    this.setState({
      width: width,
      height: height
    });
  }

  // collapse graph container to width of <section> element
  collapseContainer() {
    const width = ReactDOM.findDOMNode(this).clientWidth;
    const height = (width * 3) / 4;
    this.setState({
      width: width,
      height: height
    });
  }

  // set dimensions of graph container
  setDimensions(event) {
    const box = event.target;
    if (!box)
      return;
    const value = parseInt(box.value) || '';
    if (box.id === 'graph_width')
      this.setState({ width: value });
    if (box.id === 'graph_height')
      this.setState({ height: value });
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

  // display component
  render() {
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
              onClick={() => {
                if (this.graph.current)
                  this.graph.current.fitView();
              }}
              tooltipText='Fit the view to the graph'
            />
            <TextButton
              text='.svg'
              icon={faDownload}
              onClick={this.downloadSvg}
              tooltipText='Download the graph as an .svg file'
            />
            <input
              type='number'
              id='graph_width'
              value={this.state.width}
              onChange={this.setDimensions}
              step='5'
            />
            &times;
            <input
              type='number'
              id='graph_height'
              value={this.state.height}
              onChange={this.setDimensions}
              step='5'
            />
            <TextButton
              className='graph_expand_collapse_button'
              text=''
              icon={faExpandArrowsAlt}
              onClick={this.expandContainer}
              tooltipText='Fit the container to the window'
            />
            <TextButton
              className='graph_expand_collapse_button'
              text=''
              icon={faCompressArrowsAlt}
              onClick={this.collapseContainer}
              tooltipText='Fit the container to the "Path Graph" section'
            />
            <span className='small light right'>
              {this.state.nodeCount} nodes, {this.state.edgeCount} edges
            </span>
          </div>
          <Graph
            ref={this.graph}
            setGraphCounts={this.setGraphCounts}
            width={this.state.width}
            height={this.state.height}
            sectionWidth={this.state.sectionWidth}
          />
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
    this.onNodeDragStart = this.onNodeDragStart.bind(this);
    this.onNodeDragEnd = this.onNodeDragEnd.bind(this);
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
      for (const newNode of this.state.data.nodes) {
        for (const oldNode of prevState.data.nodes) {
          if (newNode.id === oldNode.id) {
            newNode.x = oldNode.x;
            newNode.y = oldNode.y;
            newNode.fx = oldNode.fx;
            newNode.fy = oldNode.fy;
            newNode.vx = oldNode.vx;
            newNode.vy = oldNode.vy;
            break;
          }
        }
      }

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
          .id((d) => d.id)
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
    const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x);
    const sourceRadius = nodeRadius - 1;
    let targetRadius = nodeRadius - 1;
    if (d.directed)
      targetRadius += edgeArrowSize;

    const edge = s[i];
    d3.select(edge)
      .attr('x1', d.source.x + sourceRadius * Math.cos(angle))
      .attr('y1', d.source.y + sourceRadius * Math.sin(angle))
      .attr('x2', d.target.x - targetRadius * Math.cos(angle))
      .attr('y2', d.target.y - targetRadius * Math.sin(angle));
  }

  // position edge label in center of edge line and rotate
  positionEdgeLabel(d, i, s) {
    const translateX = (d.source.x + d.target.x) / 2;
    const translateY = (d.source.y + d.target.y) / 2;
    let rotate =
      (Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x) * 180) /
      Math.PI;
    if (d.source.x > d.target.x)
      rotate += 180;

    const edgeLabel = s[i];
    d3.select(edgeLabel)
      .attr('x', 0)
      .attr('y', 0)
      .attr(
        'transform',
        ' translate(' +
          translateX +
          ',' +
          translateY +
          ') ' +
          ' rotate(' +
          rotate +
          ') '
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
      .append('line')
      .merge(edgeLineHighlights)
      .attr('class', 'graph_edge_line_highlight')
      .attr('stroke', highlightColor)
      .attr('stroke-width', edgeThickness * 4)
      .attr('opacity', 0.35);

    edgeLineHighlights.exit().remove();
  }

  // draw edge line elements
  updateEdgeLines() {
    const data = this.state.data;
    const layer = d3.select('#graph_edge_line_layer');

    const edgeLines = layer.selectAll('.graph_edge_line').data(data.edges);

    edgeLines
      .enter()
      .append('line')
      .merge(edgeLines)
      .attr('class', 'graph_edge_line')
      .attr('marker-end', (d) => {
        if (d.directed)
          return 'url(#graph_arrowhead)';
        else
          return '';
      })
      .attr('stroke', inkColor)
      .attr('stroke-width', edgeThickness);

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
      .merge(edgeLabels)
      .attr('class', 'graph_edge_label')
      .attr('font-size', edgeFontSize)
      .attr('font-weight', 500)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('fill', inkColor)
      .attr('dy', -edgeFontSize / 4)
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
      .attr('stroke-width', edgeThickness * 4)
      .attr('opacity', 0.35);

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
      .merge(nodeCircles)
      .attr('class', 'graph_node_circle')
      .attr('r', nodeRadius)
      .attr('fill', (d) => this.getNodeFillColor(d.metanode))
      .style('cursor', 'pointer')
      .call(this.state.nodeDragHandler);

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
      .html((d) => {
        if (d.name.length > nodeCharLimit)
          return d.name.substr(0, nodeCharLimit - 3) + '...';
        else
          return d.name;
      });

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
      if (node.id === data.source) {
        if (!node.x && !node.fx)
          node.fx = -nodeDistance * 2;
        if (!node.y && !node.fy)
          node.fy = 0;
      }
      if (node.id === data.target) {
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
    const graph = { source: null, target: null, nodes: [], edges: [] };

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
    graph.source = firstPath.node_ids[0];
    graph.target = firstPath.node_ids[firstPath.node_ids.length - 1];

    // loop through all paths in pathQueries
    for (const pathQuery of pathQueries) {
      for (const path of pathQuery.paths) {
        // if not checked, don't include in graph
        if (!path.checked)
          continue;

        // loop through nodes in path
        for (const nodeId of path.node_ids) {
          const existingNode = graph.nodes.find((node) => node.id === nodeId);
          if (!existingNode) {
            // if node hasn't been added to graph yet, add it
            graph.nodes.push({
              id: nodeId,
              metanode: pathQuery.nodes[nodeId].metanode,
              name: pathQuery.nodes[nodeId].data.name,
              highlighted: path.highlighted
            });
          } else if (path.highlighted)
            // if node already in graph, still update highlight status
            existingNode.highlighted = true;
        }

        // loop through edges in path
        for (const relId of path.rel_ids) {
          const existingEdge = graph.edges.find(
            (edge) =>
              edge.source === pathQuery.relationships[relId].source_neo4j_id &&
              edge.target === pathQuery.relationships[relId].target_neo4j_id
          );
          if (!existingEdge) {
            // if edge hasn't been added to graph yet, add it
            graph.edges.push({
              source: pathQuery.relationships[relId].source_neo4j_id,
              target: pathQuery.relationships[relId].target_neo4j_id,
              kind: pathQuery.relationships[relId].kind,
              directed: pathQuery.relationships[relId].directed,
              highlighted: path.highlighted
            });
          } else if (path.highlighted)
            // if edge already in graph, still update highlight status
            existingEdge.highlighted = true;
        }
      }
    }

    // sort by key === true last
    function compareBoolean(a, b, key) {
      if (a[key] === true && b[key] !== true)
        return 1;
      else if (a[key] !== true && b[key] === true)
        return -1;
      else
        return 0;
    }

    // sort lists by highlighted last to ensure higher z-index
    graph.nodes.sort((a, b) => compareBoolean(a, b, 'highlighted'));
    graph.edges.sort((a, b) => compareBoolean(a, b, 'highlighted'));

    // put source and target node at end of list to ensure highest z-index
    const sourceNodeIndex = graph.nodes.findIndex(
      (node) => node.id === graph.source
    );
    if (sourceNodeIndex !== -1)
      graph.nodes.push(graph.nodes.splice(sourceNodeIndex, 1)[0]);
    const targetNodeIndex = graph.nodes.findIndex(
      (node) => node.id === graph.target
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
      const minLeft = this.props.sectionWidth / 2 - window.innerWidth / 2 + 20;
      if (left < minLeft)
        left = minLeft;
    }

    return (
      <div id='graph_container' style={{ height: this.props.height }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          id='graph'
          width={this.props.width}
          height={this.props.height}
          style={{ left: left }}
        >
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
              refX='1'
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
    pathQueries: state.pathQueries,
    hetioStyles: state.hetioStyles
  }),
  null,
  null,
  { forwardRef: true }
)(Graph);