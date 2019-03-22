export class Metatypes {
  static nodes = [
    'Gene',
    'Compound',
    'Anatomy',
    'Disease',
    'Symptom',
    'Side Effect',
    'Biological Process',
    'Cellular Component',
    'Molecular Function',
    'Pathway',
    'Pharmacologic Class'
  ];
  static edges = [
    'causes',
    'palliates',
    'downregulates',
    'expresses',
    'covaries',
    'upregulates',
    'presents',
    'treats',
    'localizes',
    'participates',
    'binds',
    'includes',
    'associates',
    'interacts',
    'resembles',
    'regulates'
  ];
  static abbreviations = {
    'Gene': 'G',
    'Compound': 'C',
    'Anatomy': 'A',
    'Symptom': 'S',
    'Disease': 'D',
    'Side Effect': 'SE',
    'Biological Process': 'BP',
    'Cellular Component': 'CC',
    'Molecular Function': 'MF',
    'Pathway': 'PW',
    'Pharmacologic Class': 'PC',
    'causes': 'c',
    'palliates': 'p',
    'downregulates': 'd',
    'expresses': 'e',
    'covaries': 'c',
    'upregulates': 'u',
    'presents': 'p',
    'treats': 't',
    'localizes': 'l',
    'participates': 'p',
    'binds': 'b',
    'includes': 'i',
    'associates': 'a',
    'interacts': 'i',
    'resembles': 'r',
    'regulates': 'r'
  };
}
