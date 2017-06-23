

export class Group {
  id: number;

  

  constructor (object?: any) {
    if (object) {
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.Group : ' + (this.id ? this.id : '(unsaved)');
  }
}