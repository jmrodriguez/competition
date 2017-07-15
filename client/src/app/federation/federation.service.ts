import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Federation} from './federation';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "../helpers/list-result.interface";

@Injectable()
export class FederationService {

  constructor(private http: Http) {
  }

  list(textFilter: string = null,
       page: number = 1,
       max: number = 100,
       sort: string = null,
       order: string = null): Observable<ListResult<Federation>> {
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

    return this.http.get('federation', { search: params }).map(res => res.json())
  }

  get(id: number): Observable<Federation> {
    return this.http.get('federation/'+id)
      .map((r: Response) => new Federation(r.json()));
  }

  save(federation: Federation): Observable<Federation> {
    const requestOptions = new RequestOptions();
    if (federation.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'federation/' + federation.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'federation';
    }
    requestOptions.body = JSON.stringify(federation);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Federation(r.json()));
  }

  destroy(federation: Federation): Observable<boolean> {
    return this.http.delete('federation/' + federation.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}