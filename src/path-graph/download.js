import { makeFilenameFriendly } from 'hetio-frontend-components';
import { downloadSvg } from 'hetio-frontend-components';

import decode from 'unescape';

// download path graph
export function download(sourceNode, targetNode) {
  if (!sourceNode.name || !targetNode.name) return;

  let svg = document.getElementById('graph');
  if (!svg) return;

  svg = decode(svg.outerHTML);

  const filename = [
    'graph',
    makeFilenameFriendly(sourceNode.name),
    makeFilenameFriendly(targetNode.name)
  ].join('_');

  downloadSvg(svg, filename);
}
