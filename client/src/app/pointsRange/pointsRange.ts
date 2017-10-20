import { Federation } from '../federation/federation';

export class PointsRange {
  id: number;

  name: string;
  min: any;
  max: any;
  federation: Federation;

  constructor (object?: any) {
    if (object) {
      
      if (object.hasOwnProperty('federation')) {
        this.federation = new Federation(object['federation']);
        delete object['federation'];
      }

      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.PointsRange : ' + (this.id ? this.id : '(unsaved)');
  }
}