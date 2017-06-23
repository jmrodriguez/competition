import { Match } from '../match/match';
import { Group } from '../group/group';
import { Tournament } from '../tournament/tournament';
import { Category } from '../category/category';

export class TournamentCategory {
  id: number;

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
      
      if (object.hasOwnProperty('drawMatches')) {
        this.drawMatches = object['drawMatches'].map((obj: any) => { return new Match(obj); });
        delete object['drawMatches'];
      }
      
      if (object.hasOwnProperty('groups')) {
        this.groups = object['groups'].map((obj: any) => { return new Group(obj); });
        delete object['groups'];
      }
      
      if (object.hasOwnProperty('tournament')) {
        this.tournament = new Tournament(object['tournament']);
        delete object['tournament'];
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
    return 'org.competition.TournamentCategory : ' + (this.id ? this.id : '(unsaved)');
  }
}