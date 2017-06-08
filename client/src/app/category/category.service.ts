import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Category} from './category';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class CategoryService {

  private baseUrl = 'http://localhost:8080/';

  constructor(private http: Http) {
  }

  list(): Observable<Category[]> {
    let subject = new Subject<Category[]>();
    this.http.get('category')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new Category(item)))
      });
    return subject.asObservable();
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