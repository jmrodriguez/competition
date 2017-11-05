import { Weight } from '../weight/weight';
import { Federation } from '../federation/federation';
import {TournamentMatch} from "../tournamentMatch/tournamentMatch";
import {TournamentGroup} from "../tournamentGroup/tournamentGroup";
import {Category} from "../category/category";
import {Player} from "../player/player";
import {PointsRange} from "../pointsRange/pointsRange";

export class Tournament {
  id: number;

  name: string;
  date: any;
  weight: Weight;
  genderRestricted: boolean;
  gender: string;
  federation: Federation;
  bestOf: any;
  groupsOf: any;
  includeGroupPhase: boolean;
  draw: string;
  bracketInfo: string;
  seedOrder: string;
  byes: Player[];
  bracketMatches: TournamentMatch[];
  groups: TournamentGroup[];
  tournament: Tournament;
  category: Category;
  pointsRange: PointsRange;

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

      if (object.hasOwnProperty('bracketMatches')) {
        this.bracketMatches = object['bracketMatches'].map((obj: any) => { return new TournamentMatch(obj); });
        delete object['bracketMatches'];
      }

      if (object.hasOwnProperty('groups')) {
        this.groups = object['groups'].map((obj: any) => { return new TournamentGroup(obj); });
        delete object['groups'];
      }

      if (object.hasOwnProperty('category')) {
        this.category = new Category(object['category']);
        delete object['category'];
      }

      if (object.hasOwnProperty('pointsRange')) {
        this.pointsRange = new PointsRange(object['pointsRange']);
        delete object['pointsRange'];
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