// url for hetmech specific definitions (path count, p value, dwpc, etc)
import hetmechDefinitions from './definitions.json';
// url for metagraph (node and edge metatypes and abbreviations)
const metagraphUrl =
  'https://raw.githubusercontent.com/hetio/hetionet/6e08d3039abaad8f6dafe26fe3b143773b0d7e51/hetnet/json/hetionet-v1.0-metagraph.json';
// url for hetio definitions (metanodes, properties, etc)
const hetioDefinitions =
  'https://raw.githubusercontent.com/hetio/hetionet/6e08d3039abaad8f6dafe26fe3b143773b0d7e51/describe/definitions.json';
// url for hetio styles (metanode fill/text color, etc)
const hetioStyles =
  'https://raw.githubusercontent.com/hetio/hetionet/6e08d3039abaad8f6dafe26fe3b143773b0d7e51/describe/styles.json';
// url for node search
const nodeSearchUrl = 'https://search-api.het.io/v1/nodes/';
// url for node search with results sorted by metapath count
const nodeSearchMetapathsUrl =
  'https://search-api.het.io/v1/count-metapaths-to/';
// url for random node pair
const randomNodeUrl = 'https://search-api.het.io/v1/random-node-pair/';
// url for metapaths search
const metapathSearchUrl = 'https://search-api.het.io/v1/query-metapaths/';
// url for paths search
const pathSearchUrl = 'https://search-api.het.io/v1/query-paths/';

// get resource at url and parse as json
export async function fetchJson(url, dontCache) {
  // get type of query (eg, random-node-pair, query-paths, etc )
  const type = url.substr(0, url.lastIndexOf('/'));
  // set up global store of fetch abort controllers if it doesn't exist
  if (!window.fetchAbortControllers)
    window.fetchAbortControllers = {};

  // if a request of this type is already in progress
  if (window.fetchAbortControllers[type]) {
    console.log('abort request', type)
    // abort it
    window.fetchAbortControllers[type].abort();
    // and remove controller
    window.fetchAbortControllers[type] = null;
  }

  // make a new controller for this request
  const controller = new AbortController();
  // put it in store
  window.fetchAbortControllers[type] = controller;

  try {
    // check if exact query has already been made during this session
    // if so, use cache of that. if not, query server
    const cachedResponse = window.sessionStorage.getItem(url);
    if (cachedResponse && !dontCache)
      return JSON.parse(cachedResponse);

    const response = await fetch(url, {
      method: 'get',
      signal: AbortController.signal
    });
    let json = {};
    if (response.ok)
      json = await response.json();
    else
      console.log(response);

    // save response to cache
    if (!dontCache)
      window.sessionStorage.setItem(url, JSON.stringify(json));

    // remove controller if request completes without any conflicts
    window.fetchAbortControllers[type] = null;

    return json;
  } catch (error) {
    console.log(error, url);
    return {};
  }
}

// get metagraph
export function getMetagraph() {
  return fetchJson(metagraphUrl);
}

// get hetio definitions
export function getHetioDefinitions() {
  return fetchJson(hetioDefinitions);
}

// get hetio styles
export function getHetioStyles() {
  return fetchJson(hetioStyles);
}

// get hetmech definitions
export function getHetmechDefinitions() {
  return hetmechDefinitions;
}

// lookup node by id
export function lookupNodeById(id) {
  if (!id)
    return null;
  const query = nodeSearchUrl + id;
  return fetchJson(query);
}

// search for nodes by string, and with metatype filter list
// accepts comma-separated list of abbreviations of metatypes to include
export function searchNodes(searchString, metatypes, otherNode) {
  const params = new URLSearchParams();
  params.set('search', searchString);
  params.set('limit', '100');
  if (metatypes)
    params.set('metanodes', metatypes);
  if (otherNode)
    params.set('count-metapaths-to', otherNode);
  const query = nodeSearchUrl + '?' + params.toString();
  return fetchJson(query).then((response) => {
    return response.results;
  });
}

// search for nodes sorted by metapath count
export function searchNodesMetapaths(otherNode) {
  const query = nodeSearchMetapathsUrl + otherNode;
  return fetchJson(query).then((response) => {
    return response.results;
  });
}

// get random source/target node pair that has metapath(s)
export function getRandomNodePair() {
  const query = randomNodeUrl;
  return fetchJson(query, true).then((response) => {
    return response;
  });
}

// search for metapaths by source/target id
export function searchMetapaths(sourceNodeId, targetNodeId, complete) {
  const params = new URLSearchParams();
  params.set('source', sourceNodeId);
  params.set('target', targetNodeId);
  if (complete)
    params.set('complete', '');
  const query = metapathSearchUrl + '?' + params.toString();
  return fetchJson(query).then((response) => {
    return response.path_counts;
  });
}

// search for paths by metapaths
export function searchPaths(sourceNodeId, targetNodeId, metapath) {
  const params = new URLSearchParams();
  params.set('source', sourceNodeId);
  params.set('target', targetNodeId);
  params.set('metapath', metapath);
  const query = pathSearchUrl + '?' + params.toString();
  return fetchJson(query).then((response) => {
    return response;
  });
}
