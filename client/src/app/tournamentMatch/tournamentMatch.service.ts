import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "../helpers/list-result.interface";
import {TournamentMatch} from './tournamentMatch';
import {Tournament} from "../tournament/tournament";

@Injectable()
export class TournamentMatchService {

  constructor(private http: Http) {
  }

  list(tournament:Tournament): Observable<ListResult<TournamentMatch>> {
    let params = new URLSearchParams();
    if (tournament) {
      params.set('tournamentId', String(tournament.id))
    }

    return this.http.get('tournament/groups', { search: params }).map(res => res.json())
  }

  get(tournament:Tournament, number: number): Observable<TournamentMatch> {
    return this.http.get('tournament/group/' + String(tournament.id) + "/" + number)
      .map((r: Response) => new TournamentMatch(r.json()));
  }
}