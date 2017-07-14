import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Category} from './category';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import {ListResult} from "../helpers/list-result.interface";

@Injectable()
export class CategoryService {

  constructor(private http: Http) {
  }

  list(textFilter: string = null,
       page: number = 1,
       max: number = 100,
       sort: string = null,
       order: string = null): Observable<ListResult<Category>> {
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

    return this.http.get('category', { search: params }).map(res => res.json())
  }

  get(id: number): Observable<Category> {
    return this.http.get('category/'+id)
      .map((r: Response) => new Category(r.json()));
  }

  save(category: Category): Observable<Category> {
    const requestOptions = new RequestOptions();
    if (category.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'category/' + category.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'category';
    }
    requestOptions.body = JSON.stringify(category);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Category(r.json()));
  }

  destroy(category: Category): Observable<boolean> {
    return this.http.delete('category/' + category.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}