// information/definitions for metanodes and metaedges
export class Metatypes {
  // ordered list of nodes and their relevant display properties
  static nodes = [
    {
      name: 'Gene',
      abbreviation: 'G',
      backgroundColor: '#0096ff',
      textColor: '#ffffff'
    },
    {
      name: 'Compound',
      abbreviation: 'C',
      backgroundColor: '#ff2600',
      textColor: '#ffffff'
    },
    {
      name: 'Anatomy',
      abbreviation: 'A',
      backgroundColor: '#008f00',
      textColor: '#ffffff'
    },
    {
      name: 'Disease',
      abbreviation: 'D',
      backgroundColor: '#8e4f00',
      textColor: '#ffffff'
    },
    {
      name: 'Symptom',
      abbreviation: 'S',
      backgroundColor: '#a5abb6',
      textColor: '#ffffff'
    },
    {
      name: 'Side Effect',
      abbreviation: 'SE',
      backgroundColor: '#fffb00',
      textColor: '#000000'
    },
    {
      name: 'Biological Process',
      abbreviation: 'BP',
      backgroundColor: '#ff9300',
      textColor: '#ffffff'
    },
    {
      name: 'Cellular Component',
      abbreviation: 'CC',
      backgroundColor: '#ff9300',
      textColor: '#ffffff'
    },
    {
      name: 'Molecular Function',
      abbreviation: 'MF',
      backgroundColor: '#ff9300',
      textColor: '#ffffff'
    },
    {
      name: 'Pathway',
      abbreviation: 'PW',
      backgroundColor: '#ff9300',
      textColor: '#ffffff'
    },
    {
      name: 'Pharmacologic Class',
      abbreviation: 'PC',
      backgroundColor: '#ff85ff',
      textColor: '#ffffff'
    }
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
    const entries = this.nodes.concat(this.edges);
    const keys = ['name', 'abbreviation'];
    for (const key of keys) {
      for (const entry of entries) {
        if (entry[key].toLowerCase() === search.toLowerCase())
          return entry;
      }
    }
    return null;
  }
}
