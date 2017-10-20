import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {PointsRange} from './pointsRange';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "../helpers/list-result.interface";

@Injectable()
export class PointsRangeService {

  constructor(private http: Http) {
  }

  list(textFilter: string = null,
       page: number = 1,
       max: number = 5,
       sort: string = null,
       order: string = null): Observable<ListResult<PointsRange>> {
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

    return this.http.get('pointsRange', { search: params }).map(res => res.json())
  }

  get(id: number): Observable<PointsRange> {
    return this.http.get('pointsRange/'+id)
      .map((r: Response) => new PointsRange(r.json()));
  }

  save(pointsRange: PointsRange): Observable<PointsRange> {
    const requestOptions = new RequestOptions();
    if (pointsRange.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'pointsRange/' + pointsRange.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'pointsRange';
    }
    requestOptions.body = JSON.stringify(pointsRange);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new PointsRange(r.json()));
  }

  destroy(pointsRange: PointsRange): Observable<boolean> {
    return this.http.delete('pointsRange/' + pointsRange.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }

}