import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from './user';
import { ListResult } from '../helpers/list-result.interface'

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class UserService {

  constructor(private http: Http) {
  }

  list(textFilter: string = null, page: number = 1, max: number = 5): Observable<ListResult<User>> {
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

    return this.http.get('user', { search: params }).map(res => res.json())

    /*let subject = new Subject<User[]>();
    this.http.get('user')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new User(item)))
      });
    return subject.asObservable();*/
  }

  get(id: number): Observable<User> {
    return this.http.get('user/'+id)
      .map((r: Response) => new User(r.json()));
  }

  save(user: User): Observable<User> {
    const requestOptions = new RequestOptions();
    if (user.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'user/' + user.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'user';
    }
    requestOptions.body = JSON.stringify(user);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new User(r.json()));
  }

  destroy(user: User): Observable<boolean> {
    return this.http.delete('user/' + user.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}