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
  return (await fetchJson(metagraphUrl)) || {};
}

// get hetio definitions
export async function getHetioDefinitions() {
  return (await fetchJson(hetioDefinitions)) || {};
}

// get hetio styles
export async function getHetioStyles() {
  return (await fetchJson(hetioStyles)) || {};
}

// get hetmech definitions
export function getHetmechDefinitions() {
  return hetmechDefinitions || {};
}

// lookup node by id
export async function lookupNodeById(id) {
  if (!id && id !== 0)
    return {};
  const query = nodeSearchUrl + id;
  return (await fetchJson(query)) || {};
}

// search for nodes by string, and with metatype filter list
// accepts comma-separated list of abbreviations of metatypes to include
export async function searchNodes(searchString, metatypes, otherNodeId) {
  const params = new URLSearchParams();
  params.set('search', searchString);
  params.set('limit', '100');
  if (metatypes)
    params.set('metanodes', metatypes);
  if (otherNodeId)
    params.set('count-metapaths-to', otherNodeId);
  const query = nodeSearchUrl + '?' + params.toString();
  const response = await fetchJson(query);
  if (response && response.results)
    return response.results;
  else
    return [];
}

// search for nodes sorted by metapath count
export async function searchNodesMetapaths(otherNodeId) {
  if (!otherNodeId && otherNodeId !== 0)
    return [];
  const query = nodeSearchMetapathsUrl + otherNodeId;
  const response = await fetchJson(query);
  if (response && response.results)
    return response.results;
  else
    return [];
}

// get random source/target node pair that has metapath(s)
export async function getRandomNodePair() {
  const query = randomNodeUrl;
  const response = await fetchJson(query, true);
  return response || {};
}

// search for metapaths by source/target id
export async function searchMetapaths(sourceNodeId, targetNodeId, complete) {
  if (
    (!sourceNodeId && sourceNodeId !== 0) ||
    (!targetNodeId && targetNodeId !== 0)
  )
    return [];
  const params = new URLSearchParams();
  params.set('source', sourceNodeId);
  params.set('target', targetNodeId);
  if (complete)
    params.set('complete', '');
  const query = metapathSearchUrl + '?' + params.toString();
  const response = await fetchJson(query);
  if (response && response.path_counts)
    return response.path_counts;
  else
    return [];
}

// search for paths by metapaths
export async function searchPaths(sourceNodeId, targetNodeId, metapath) {
  if (
    (!sourceNodeId && sourceNodeId !== 0) ||
    (!targetNodeId && targetNodeId !== 0) ||
    !metapath
  )
    return [];
  const params = new URLSearchParams();
  params.set('source', sourceNodeId);
  params.set('target', targetNodeId);
  params.set('metapath', metapath);
  const query = pathSearchUrl + '?' + params.toString();
  const response = await fetchJson(query);
  return response || [];
}
