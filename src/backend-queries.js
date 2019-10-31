// url for hetmech specific definitions (path count, p value, dwpc, etc)
import hetmechDefinitions from './definitions.json';

// url for github data
const github =
  'https://raw.githubusercontent.com/hetio/hetionet/6e08d3039abaad8f6dafe26fe3b143773b0d7e51';

// api endpoint/url for production
// const api = 'https://search-api.het.io/v1/';
// api endpoint/url for testing
const api = 'http://localhost:8000/v1';

// get resource at url and parse as json
export async function fetchJson(url, dontCache) {
  try {
    // check if exact query has already been made during this session
    // if so, use cache of that. if not, query server
    const cachedResponse = window.sessionStorage.getItem(url);
    if (cachedResponse && !dontCache)
      return JSON.parse(cachedResponse);

    const response = await fetch(url);
    let json = {};
    if (response.ok)
      json = await response.json();
    else {
      console.error(response);
      return;
    }

    // save response to cache
    if (!dontCache)
      window.sessionStorage.setItem(url, JSON.stringify(json));

    return json;
  } catch (error) {
    console.error(error, url);
    return;
  }
}

// get metagraph
export async function getMetagraph() {
  const query = join(github, 'hetnet/json/hetionet-v1.0-metagraph.json');
  return (await fetchJson(query)) || {};
}

// get hetio definitions
export async function getHetioDefinitions() {
  const query = join(github, 'describe/definitions.json');
  return (await fetchJson(query)) || {};
}

// get hetio styles
export async function getHetioStyles() {
  const query = join(github, 'describe/styles.json');
  return (await fetchJson(query)) || {};
}

// get hetmech definitions
export function getHetmechDefinitions() {
  return hetmechDefinitions || {};
}

// lookup node by id
export async function lookupNode(id) {
  const query = join(api, 'node', id);
  return (await fetchJson(query)) || {};
}

// search for nodes by string, and with metanode filter list
// accepts comma-separated list of abbreviations of metanodes to include
export async function searchNodes(searchString, otherNodeId, metanodes) {
  const params = new URLSearchParams();
  if (searchString)
    params.set('search', searchString);
  params.set('metanodes', metanodes || '');
  params.set('other-node', otherNodeId || '');
  const query = join(api, 'nodes', '?' + params.toString());
  const response = await fetchJson(query);
  if (response && response.results)
    return response.results;
  else
    return [];
}

// get random source/target node pair that has any (precomputed) metapaths
export async function getRandomNodePair() {
  const query = join(api, 'random-node-pair');
  const response = await fetchJson(query, true);
  return response || {};
}

// search for metapaths by source/target node id
export async function searchMetapaths(sourceNodeId, targetNodeId, complete) {
  const query = join(
    api,
    'metapaths',
    'source',
    sourceNodeId,
    'target',
    targetNodeId,
    complete ? '?complete' : ''
  );
  const response = await fetchJson(query);
  if (response && response.path_counts)
    return response.path_counts;
  else
    return [];
}

// search for paths by source/target node id and metapath
export async function searchPaths(sourceNodeId, targetNodeId, metapath) {
  const query = join(
    api,
    'paths',
    'source',
    sourceNodeId,
    'target',
    targetNodeId,
    'metapath',
    metapath
  );
  const response = await fetchJson(query);
  return response || [];
}

function join(...pieces) {
  return pieces.join('/');
}
