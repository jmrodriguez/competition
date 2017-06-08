import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Weight} from './weight';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class WeightService {

  constructor(private http: Http) {
  }

  list(): Observable<Weight[]> {
    let subject = new Subject<Weight[]>();
    this.http.get('weight')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new Weight(item)))
      });
    return subject.asObservable();
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