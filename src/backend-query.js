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
const nodeSearchServer = 'https://search-api.het.io/v1/nodes/';
// url for node search with results sorted by metapath count
const nodeSearchMetapathsServer =
  'https://search-api.het.io/v1/count-metapaths-to/';
// url for random node pair
const randomNodeServer = 'https://search-api.het.io/v1/random-node-pair/';
// url for metapaths search
const metapathSearchServer = 'https://search-api.het.io/v1/query-metapaths/';
// url for paths search
const pathSearchServer = 'https://search-api.het.io/v1/query-paths/';

// get resource at url and parse as json
export function fetchJson(url, dontCache) {
  // check if query has already been made during this session
  // if so, use cache of that. if not, query server
  const cachedResponse = window.sessionStorage.getItem(url);
  if (cachedResponse && !dontCache)
    return Promise.resolve(JSON.parse(cachedResponse));
  else {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          console.log('response', response.status);
          return {};
        } else
          return response.json();
      })
      .then((results) => {
        if (!dontCache) {
          try {
            // save response to cache. use try/catch in case storage
            window.sessionStorage.setItem(url, JSON.stringify(results));
          } catch (error) {
            console.log(error, url);
          }
        }
        return results || {};
      })
      .catch((error) => {
        console.log(error, url);
        return {};
      });
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
  return Promise.resolve(hetmechDefinitions);
}

// lookup node by id
export function lookupNodeById(id) {
  if (!id)
    return null;
  const query = nodeSearchServer + id;
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
  const query = nodeSearchServer + '?' + params.toString();
  return fetchJson(query).then((response) => {
    return response.results;
  });
}

// search for nodes sorted by metapath count
export function searchNodesMetapaths(otherNode) {
  const query = nodeSearchMetapathsServer + otherNode;
  return fetchJson(query).then((response) => {
    return response.results;
  });
}

// get random source/target node pair that has metapath(s)
export function getRandomNodePair() {
  const query = randomNodeServer;
  return fetchJson(query, true).then((response) => {
    return response;
  });
}

// search for metapaths by source/target id
export function searchMetapaths(sourceId, targetId) {
  const params = new URLSearchParams();
  params.set('source', sourceId);
  params.set('target', targetId);
  params.set('complete', '');
  const query = metapathSearchServer + '?' + params.toString();
  return fetchJson(query).then((response) => {
    return response.path_counts;
  });
}

// search for paths by metapaths
export function searchPaths(sourceId, targetId, metapath) {
  const params = new URLSearchParams();
  params.set('source', sourceId);
  params.set('target', targetId);
  params.set('metapath', metapath);
  const query = pathSearchServer + '?' + params.toString();
  return fetchJson(query).then((response) => {
    return response;
  });
}
