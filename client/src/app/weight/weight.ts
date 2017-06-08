

export class Weight {
  id: number;

  name: string;
  factor: any;

  constructor (object?: any) {
    if (object) {
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.Weight : ' + (this.id ? this.id : '(unsaved)');
  }
}