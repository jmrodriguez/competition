import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Player} from './player';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class PlayerService {

  constructor(private http: Http) {
  }

  list(): Observable<Player[]> {
    let subject = new Subject<Player[]>();
    this.http.get('player')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new Player(item)))
      });
    return subject.asObservable();
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