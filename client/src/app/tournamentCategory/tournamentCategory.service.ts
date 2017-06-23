import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {TournamentCategory} from './tournamentCategory';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class TournamentCategoryService {

  constructor(private http: Http) {
  }

  get(tournamentId:number, categoryId:number): Observable<TournamentCategory> {
    return this.http.get('tournamentCategory/' + tournamentId + "/" + categoryId)
      .map((r: Response) => new TournamentCategory(r.json()));
  }

  save(tournamentCategory: TournamentCategory): Observable<TournamentCategory> {
    const requestOptions = new RequestOptions();
    if (tournamentCategory.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'tournamentCategory/' + tournamentCategory.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'tournamentCategory';
    }
    requestOptions.body = JSON.stringify(tournamentCategory);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new TournamentCategory(r.json()));
  }

  destroy(tournamentCategory: TournamentCategory): Observable<boolean> {
    return this.http.delete('tournamentCategory/' + tournamentCategory.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}