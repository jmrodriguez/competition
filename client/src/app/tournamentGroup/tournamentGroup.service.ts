import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "../helpers/list-result.interface";
import {TournamentGroup} from './tournamentGroup';
import {Tournament} from "../tournament/tournament";

@Injectable()
export class TournamentGroupService {

  constructor(private http: Http) {
  }

  list(tournament:Tournament): Observable<ListResult<TournamentGroup>> {
    let params = new URLSearchParams();
    if (tournament) {
      params.set('tournamentId', String(tournament.id))
    }

    return this.http.get('tournament/groups', { search: params }).map(res => res.json())
  }

  generateGroups(id: number): Observable<ListResult<TournamentGroup>> {
    return this.http.get('tournament/generateGroups/'+id).map(res => res.json())
  }

  get(tournament:Tournament, number: number): Observable<TournamentGroup> {
    return this.http.get('tournament/group/' + String(tournament.id) + "/" + number)
      .map((r: Response) => new TournamentGroup(r.json()));
  }
}