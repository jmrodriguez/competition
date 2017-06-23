import { Weight } from '../weight/weight';
import { Federation } from '../federation/federation';
import {Match} from "../match/match";
import {Group} from "../group/group";
import {Category} from "../category/category";

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
  drawMatches: Match[];
  groups: Group[];
  tournament: Tournament;
  category: Category;

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

      if (object.hasOwnProperty('drawMatches')) {
        this.drawMatches = object['drawMatches'].map((obj: any) => { return new Match(obj); });
        delete object['drawMatches'];
      }

      if (object.hasOwnProperty('groups')) {
        this.groups = object['groups'].map((obj: any) => { return new Group(obj); });
        delete object['groups'];
      }

      if (object.hasOwnProperty('category')) {
        this.category = new Category(object['category']);
        delete object['category'];
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