import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Federation} from './federation';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class FederationService {

  constructor(private http: Http) {
  }

  list(): Observable<Federation[]> {
    let subject = new Subject<Federation[]>();
    this.http.get('federation')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new Federation(item)))
      });
    return subject.asObservable();
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
    console.log("hola");
    console.log(requestOptions);

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Federation(r.json()));
  }

  destroy(federation: Federation): Observable<boolean> {
    return this.http.delete('federation/' + federation.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}