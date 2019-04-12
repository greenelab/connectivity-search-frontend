// information/definitions for metanodes and metaedges
export class Metatypes {
  // ordered list of nodes and their relevant display properties
  static nodes = [
    { name: 'Gene', abbreviation: 'G' },
    { name: 'Compound', abbreviation: 'C' },
    { name: 'Anatomy', abbreviation: 'A' },
    { name: 'Disease', abbreviation: 'D' },
    { name: 'Symptom', abbreviation: 'S' },
    { name: 'Side Effect', abbreviation: 'SE' },
    { name: 'Biological Process', abbreviation: 'BP' },
    { name: 'Cellular Component', abbreviation: 'CC' },
    { name: 'Molecular Function', abbreviation: 'MF' },
    { name: 'Pathway', abbreviation: 'PW' },
    { name: 'Pharmacologic Class', abbreviation: 'PC' }
  ];

  // ordered list of edges and their relevant display properties
  static edges = [
    { name: 'causes', abbreviation: 'c' },
    { name: 'palliates', abbreviation: 'p' },
    { name: 'downregulates', abbreviation: 'd' },
    { name: 'expresses', abbreviation: 'e' },
    { name: 'covaries', abbreviation: 'c' },
    { name: 'upregulates', abbreviation: 'u' },
    { name: 'presents', abbreviation: 'p' },
    { name: 'treats', abbreviation: 't' },
    { name: 'localizes', abbreviation: 'l' },
    { name: 'participates', abbreviation: 'p' },
    { name: 'binds', abbreviation: 'b' },
    { name: 'includes', abbreviation: 'i' },
    { name: 'associates', abbreviation: 'a' },
    { name: 'interacts', abbreviation: 'i' },
    { name: 'resembles', abbreviation: 'r' },
    { name: 'regulates', abbreviation: 'r' }
  ];

  // look up a node or edge by any key (name, abbreviation, etc)
  static lookup(search) {
    if (!search)
      search = '';
    const entries = this.nodes.concat(this.edges);
    const keys = ['name', 'abbreviation'];
    for (const key of keys) {
      for (const entry of entries) {
        if (entry[key].toLowerCase() === search.toLowerCase())
          return entry;
      }
    }
    return {};
  }
}
