import { Tournament } from '../tournament/tournament';
import { Federation } from '../federation/federation';

export class Player {
  id: number;

  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  club: string;
  birth: Date;
  points: any;
  pointsFed: any;
  ranking: any;
  rankingFed: any;
  pointsLm: any;
  pointsLmFed: any;
  pointsLmFemFed: any;
  rankingLm: any;
  rankingLmFem: any;
  rankingLmFed: any;
  rankingLmFemFed: any;
  pointsFem: any;
  pointsFemFed: any;
  rankingFem: any;
  rankingFemFed: any;
  gender: string;
  fixedPointsFed: any;
  tournaments: Tournament[];
  fixedPointsLm: any;
  fixedPointsFemFed: any;
  fixedPointsFem: any;
  fixedPointsLmFem: any;
  fixedPoints: any;
  federation: Federation;
  fixedPointsLmFed: any;
  fixedPointsLmFemFed: any;

  constructor (object?: any) {
    if (object) {
      
      if (object.hasOwnProperty('tournaments')) {
        this.tournaments = object['tournaments'].map((obj: any) => { return new Tournament(obj); });
        delete object['tournaments'];
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
    return 'org.competition.Player : ' + (this.id ? this.id : '(unsaved)');
  }
}