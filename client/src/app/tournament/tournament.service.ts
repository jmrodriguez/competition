import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Tournament} from './tournament';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "../helpers/list-result.interface";
import {Player} from "../player/player";
import {TournamentGroup} from "../tournamentGroup/tournamentGroup";
import {TournamentMatch} from "../tournamentMatch/tournamentMatch";

@Injectable()
export class TournamentService {

  constructor(private http: Http) {
  }

  list(textFilter: string = null,
       page: number = 1,
       max: number = 5,
       sort: string = null,
       order: string = null): Observable<ListResult<Tournament>> {
    let params = new URLSearchParams();
    if (textFilter) {
      params.set('textFilter', textFilter)
    }
    if (page) {
      params.set('page', String(page))
    }
    if (max) {
      params.set('max', String(max))
    }
    if (sort) {
      params.set('sort', String(sort))
    }
    if (order) {
      params.set('order', String(order))
    }

    return this.http.get('tournament', { search: params }).map(res => res.json())
  }

  get(id: number): Observable<Tournament> {
    return this.http.get('tournament/'+id)
      .map((r: Response) => new Tournament(r.json()));
  }

  save(tournament: Tournament): Observable<Tournament> {
    const requestOptions = new RequestOptions();
    if (tournament.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'tournament/' + tournament.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'tournament';
    }
    requestOptions.body = JSON.stringify(tournament);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Tournament(r.json()));
  }

  destroy(tournament: Tournament): Observable<boolean> {
    return this.http.delete('tournament/' + tournament.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }

  signUpPlayer(tournament: Tournament, player: Player): Observable<boolean> {
    const requestOptions = new RequestOptions();

    requestOptions.method = RequestMethod.Post;
    requestOptions.url = 'tournament/signUp/' + String(player.id);

    requestOptions.body = JSON.stringify(tournament);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
        .map((res: Response) => res.ok).catch(() => {
          return Observable.of(false);
        });
  }

  signOffPlayer(tournament: Tournament, player: Player): Observable<boolean> {
    const requestOptions = new RequestOptions();

    requestOptions.method = RequestMethod.Post;
    requestOptions.url = 'tournament/signOff/' + String(player.id);

    requestOptions.body = JSON.stringify(tournament);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
        .map((res: Response) => res.ok).catch(() => {
          return Observable.of(false);
        });
  }

  generateDraw(id: number): Observable<Tournament> {
    return this.http.get('tournament/generateDraw/'+id)
        .map((r: Response) => new Tournament(r.json()));
  }

  saveBracketResults(tournament: Tournament): Observable<Tournament> {
    const requestOptions = new RequestOptions();
    requestOptions.method = RequestMethod.Post;
    requestOptions.url = 'tournament/bracketResults';

    requestOptions.body = JSON.stringify(tournament);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
        .map((r: Response) => new Tournament(r.json()));
  }

  finishTournament(tournament: Tournament): Observable<Tournament> {
      const requestOptions = new RequestOptions();
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'tournament/finishTournament';

      requestOptions.body = JSON.stringify(tournament);
      requestOptions.headers = new Headers({"Content-Type": "application/json"});

      return this.http.request(new Request(requestOptions))
          .map((r: Response) => new Tournament(r.json()));
  }

}