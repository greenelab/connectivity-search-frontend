import * as d3 from 'd3';

import { minZoom, maxZoom } from './constants.js';

export function createViewHandler() {
  // create handler for panning and zooming view
  const viewHandler = d3
    .zoom()
    .scaleExtent([minZoom, maxZoom])
    .on('zoom', onViewChange);
  d3.select('#graph').call(viewHandler);
  d3.select('#graph').on('click', onViewClick);
  return viewHandler;
}

// when view panned or zoomed by user
function onViewChange() {
  d3.select('#graph_view').attr('transform', d3.event.transform);
}

// when view/background is clicked by user
function onViewClick() {
  // this.deselectAll();
  // this.updateNodeCircles();
  // this.updateEdgeLines();
  // this.props.setSelectedElement(null);
}
