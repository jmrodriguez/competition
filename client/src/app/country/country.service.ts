import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Country} from './country';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "app/helpers/list-result.interface";

@Injectable()
export class CountryService {

  constructor(private http: Http) {
  }

  list(textFilter: string = null,
       page: number = 1,
       max: number = 100,
       sort: string = null,
       order: string = null): Observable<ListResult<Country>> {
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

    return this.http.get('country', { search: params }).map(res => res.json())
  }

  get(id: number): Observable<Country> {
    return this.http.get('country/'+id)
      .map((r: Response) => new Country(r.json()));
  }

  save(country: Country): Observable<Country> {
    const requestOptions = new RequestOptions();
    if (country.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'country/' + country.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'country';
    }
    requestOptions.body = JSON.stringify(country);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Country(r.json()));
  }

  destroy(country: Country): Observable<boolean> {
    return this.http.delete('country/' + country.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}