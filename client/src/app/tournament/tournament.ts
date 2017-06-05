

export class Tournament {
  id: number;

  name: string;

  constructor (object?: any) {
    if (object) {
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.Tournament : ' + (this.id ? this.id : '(unsaved)');
  }
}