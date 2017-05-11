

export class Todo {
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
    return 'org.competition.Todo : ' + (this.id ? this.id : '(unsaved)');
  }
}