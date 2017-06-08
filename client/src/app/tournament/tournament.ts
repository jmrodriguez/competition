import { Weight } from '../weight/weight';
import { Federation } from '../federation/federation';

export class Tournament {
  id: number;

  name: string;
  date: any;
  weight: Weight;
  genderRestricted: boolean;
  gender: string;
  federation: Federation;
  draw: string;

  constructor (object?: any) {
    if (object) {
      
      if (object.hasOwnProperty('weight')) {
        this.weight = new Weight(object['weight']);
        delete object['weight'];
      }
      
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
    return 'org.competition.Tournament : ' + (this.id ? this.id : '(unsaved)');
  }
}