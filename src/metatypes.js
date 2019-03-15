export class MetaTypes {
    static list() {
        return [
            { name: 'Gene', initial: 'G' },
            { name: 'Compound', initial: 'C' },
            { name: 'Anatomy', initial: 'A' },
            { name: 'Disease', initial: 'D' },
            { name: 'Side Effect', initial: 'E' },
            { name: 'Symptom', initial: 'S' },
            { name: 'Biological Process', initial: 'B' },
            { name: 'Cellular Component', initial: 'L' },
            { name: 'Molecular Function', initial: 'M' },
            { name: 'Pathway', initial: 'P' },
            { name: 'Pharmalogical Class', initial: 'H' }
        ];
    }
    static initial(name) {
        const list = this.list();
        for (const entry of list) {
            if (entry.name === name)
                return entry.initial;
        }
        return '?';
    }
}
