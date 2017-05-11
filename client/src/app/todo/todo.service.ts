import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Todo} from './todo';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class TodoService {

  constructor(private http: Http) {
  }

  list(): Observable<Todo[]> {
    let subject = new Subject<Todo[]>();
    this.http.get('todo')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new Todo(item)))
      });
    return subject.asObservable();
  }

  get(id: number): Observable<Todo> {
    return this.http.get('todo/'+id)
      .map((r: Response) => new Todo(r.json()));
  }

  save(todo: Todo): Observable<Todo> {
    const requestOptions = new RequestOptions();
    if (todo.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = 'todo/' + todo.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = 'todo';
    }
    requestOptions.body = JSON.stringify(todo);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Todo(r.json()));
  }

  destroy(todo: Todo): Observable<boolean> {
    return this.http.delete('todo/' + todo.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}