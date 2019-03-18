export class MetaTypes {
  static list() {
    return [
      { name: 'Gene', abbreviation: 'G' },
      { name: 'Compound', abbreviation: 'C' },
      { name: 'Anatomy', abbreviation: 'A' },
      { name: 'Disease', abbreviation: 'D' },
      { name: 'Side Effect', abbreviation: 'SE' },
      { name: 'Symptom', abbreviation: 'S' },
      { name: 'Biological Process', abbreviation: 'BP' },
      { name: 'Cellular Component', abbreviation: 'CC' },
      { name: 'Molecular Function', abbreviation: 'MF' },
      { name: 'Pathway', abbreviation: 'PW' },
      { name: 'Pharmalogical Class', abbreviation: 'PC' }
    ];
  }
  static abbreviation(name) {
    const list = this.list();
    for (const entry of list) {
      if (entry.name === name)
        return entry.abbreviation;
    }
    return '?';
  }
}
