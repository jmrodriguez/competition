

export class Country {
  id: number;

  isoCode: string;
  name: string;

  constructor (object?: any) {
    if (object) {
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.Country : ' + (this.id ? this.id : '(unsaved)');
  }
}