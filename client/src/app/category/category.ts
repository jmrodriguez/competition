

export class Category {
  id: number;

  name: string;
  minAge: number;
  maxAge: number;

  constructor (object?: any) {
    if (object) {
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.Category : ' + (this.id ? this.id : '(unsaved)');
  }
}