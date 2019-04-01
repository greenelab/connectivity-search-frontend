// url for node search
const nodeSearchServer = 'https://search-api.het.io/v1/nodes/';
// url for paths search
const pathSearchServer = 'https://search-api.het.io/v1/querypair/';

// lookup node by id
export function lookupNodeById(id) {
  if (!id)
    return null;
  const query = nodeSearchServer + id;
  return fetch(query)
    .then((response) => {
      if (response.ok)
        return response.json();
      else
        return null;
    })
    .then((data) => {
      return data;
    });
}

// search for nodes by string, and with metatype filter list
// accepts comma-separated list of abbreviations of metatypes to include
export function searchNodes(searchString, metatypes) {
  const params = new URLSearchParams();
  params.set('search', searchString);
  params.set('limit', '100');
  if (metatypes)
    params.set('metanodes', metatypes);
  const query = nodeSearchServer + '?' + params.toString();
  return fetch(query)
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    });
}

// search for metapaths by source/target id
export function searchMetapaths(sourceId, targetId) {
  const params = new URLSearchParams();
  params.set('source', sourceId);
  params.set('target', targetId);
  const query = pathSearchServer + '?' + params.toString();
  return fetch(query)
    .then((response) => response.json())
    .then((data) => {
      return data.path_counts;
    });
}
