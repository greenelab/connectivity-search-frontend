import * as d3 from 'd3';

import { minZoom, maxZoom, nodeRadius } from './constants.js';

export function createViewHandler(onViewClick, fitView) {
  const svg = d3.select('#graph');
  // create handler for panning and zooming view
  const viewHandler = d3
    .zoom()
    .scaleExtent([minZoom, maxZoom])
    .on('zoom', onViewChange);
  svg.call(viewHandler);
  svg.on('click', onViewClick);
  svg.on('dblclick.zoom', null);
  svg.on('dblclick', fitView);

  return viewHandler;
}

// when view panned or zoomed by user
function onViewChange() {
  d3.select('#graph_view').attr('transform', d3.event.transform);
}

// center view around 0,0 and reset to 100% zoom
export function resetView(viewHandler) {
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
    viewHandler.transform,
    d3.zoomIdentity.translate(translateX, translateY).scale(scale)
  );
}

// fit view to contents of graph
export function fitView(viewHandler) {
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
    viewHandler.transform,
    d3.zoomIdentity.translate(translateX, translateY).scale(scale)
  );
}
