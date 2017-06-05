import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Tournament} from './tournament';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class TournamentService {

  constructor(private http: Http) {
  }

  list(): Observable<Tournament[]> {
    let subject = new Subject<Tournament[]>();
    this.http.get('tournament')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new Tournament(item)))
      });
    return subject.asObservable();
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
}