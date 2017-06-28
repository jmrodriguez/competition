import {Player} from "../player/player";

export class TournamentGroup {
  id: number;
  winner: Player;
  runnerup: Player;
  number: number;
  players: Player[];
  

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

      if (object.hasOwnProperty('players')) {
        this.players = object['players'].map((obj: any) => { return new Player(obj); });
        delete object['players'];
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