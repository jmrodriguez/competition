import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Weight} from './weight';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "../helpers/list-result.interface";

@Injectable()
export class WeightService {

  constructor(private http: Http) {
  }

  list(textFilter: string = null,
       page: number = 1,
       max: number = 100,
       sort: string = null,
       order: string = null): Observable<ListResult<Weight>> {
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

    return this.http.get('weight', { search: params }).map(res => res.json())
  }

  get(id: number): Observable<Weight> {
    return this.http.get('weight/'+id)
      .map((r: Response) => new Weight(r.json()));
  }

  save(weight: Weight): Observable<Weight> {
    const requestOptions = new RequestOptions();
    if (weight.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'weight/' + weight.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'weight';
    }
    requestOptions.body = JSON.stringify(weight);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Weight(r.json()));
  }

  destroy(weight: Weight): Observable<boolean> {
    return this.http.delete('weight/' + weight.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}