import {Player} from "../player/player";

export class TournamentMatch {
  id: number;
  player1: Player;
  player2: Player;
  sets: string;
  points: string;
  matchNumber: number;
  winner: Player;

  constructor (object?: any) {
    if (object) {

      if (object.hasOwnProperty('player1')) {
        this.player1 = new Player(object['player1']);
        delete object['player1'];
      }

      if (object.hasOwnProperty('player2')) {
        this.player2 = new Player(object['player2']);
        delete object['player2'];
      }

      if (object.hasOwnProperty('winner')) {
        this.winner = new Player(object['winner']);
        delete object['winner'];
      }

      for (var prop in object) {
        this[prop] = object[prop];
      }
    }

  }

  toString(): string {
    return 'org.competition.TournamentMatch : ' + (this.id ? this.id : '(unsaved)');
  }
}