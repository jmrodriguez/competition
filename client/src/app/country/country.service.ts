import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, RequestMethod, Request, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Country} from './country';
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class CountryService {

  private baseUrl = 'http://localhost:8080/';

  constructor(private http: Http) {
  }

  list(): Observable<Country[]> {
    let subject = new Subject<Country[]>();
    this.http.get(this.baseUrl + 'country')
      .map((r: Response) => r.json())
      .subscribe((json: any[]) => {
        subject.next(json.map((item: any) => new Country(item)))
      });
    return subject.asObservable();
  }

  get(id: number): Observable<Country> {
    return this.http.get(this.baseUrl + 'country/'+id)
      .map((r: Response) => new Country(r.json()));
  }

  save(country: Country): Observable<Country> {
    const requestOptions = new RequestOptions();
    if (country.id) {
      requestOptions.method = RequestMethod.Put;
      requestOptions.url = this.baseUrl + 'country/' + country.id;
    } else {
      requestOptions.method = RequestMethod.Post;
      requestOptions.url = this.baseUrl + 'country';
    }
    requestOptions.body = JSON.stringify(country);
    requestOptions.headers = new Headers({"Content-Type": "application/json"});

    return this.http.request(new Request(requestOptions))
      .map((r: Response) => new Country(r.json()));
  }

  destroy(country: Country): Observable<boolean> {
    return this.http.delete(this.baseUrl + 'country/' + country.id).map((res: Response) => res.ok).catch(() => {
      return Observable.of(false);
    });
  }
}