import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Player} from './player';
import {ListResult} from "../helpers/list-result.interface";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {Tournament} from "../tournament/tournament";

@Injectable()
export class PlayerService {

  constructor(private http: Http) {
  }

  list(tournament: Tournament = null, textFilter: string = null, page: number = 1, playerType: number = 0, max: number = 5): Observable<ListResult<Player>> {
    let params = new URLSearchParams();
    if (tournament) {
      params.set('tournamentId', String(tournament.id))
    }
    if (textFilter) {
      params.set('textFilter', textFilter)
    }
    if (page) {
      params.set('page', String(page))
    }
    if (playerType) {
      params.set('playerType', String(playerType))
    }
    if (max) {
      params.set('max', String(max))
    }

    return this.http.get('player', { search: params }).map(res => res.json())
  }

  get(id: number): Observable<Player> {
    return this.http.get('player/'+id)
      .map((r: Response) => new Player(r.json()));
  }

  save(player: Player): Observable<Player> {
    const requestOptions = new RequestOptions();
    if (player.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'player/' + player.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'player';
    }
    requestOptions.body = JSON.stringify(player);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Player(r.json()));
  }

  destroy(player: Player): Observable<boolean> {
    return this.http.delete('player/' + player.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}