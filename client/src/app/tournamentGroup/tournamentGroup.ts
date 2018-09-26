import {Player} from "../player/player";
import {TournamentMatch} from "../tournamentMatch/tournamentMatch";
import {Tournament} from "../tournament/tournament";

export class TournamentGroup {
  id: number;
  winner: Player;
  runnerup: Player;
  number: number;
  tournament: Tournament;
  players: Player[];
  groupMatches: TournamentMatch[];

  constructor (object?: any) {
    if (object) {
      if (object.hasOwnProperty('winner')) {
        this.winner = new Player(object['winner']);
        delete object['winner'];
      }

      if (object.hasOwnProperty('runnerup')) {
        this.runnerup = new Player(object['runnerup']);
        delete object['runnerup'];
      }

      if (object.hasOwnProperty('tournament')) {
          this.tournament = new Tournament(object['tournament']);
          delete object['tournament'];
      }

      if (object.hasOwnProperty('players')) {
        this.players = object['players'].map((obj: any) => { return new Player(obj); });
        delete object['players'];
      }

      if (object.hasOwnProperty('groupMatches')) {
        this.groupMatches = object['groupMatches'].map((obj: any) => { return new TournamentMatch(obj); });
        delete object['groupMatches'];
      }
      
      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.Group : ' + (this.id ? this.id : '(unsaved)');
  }
}