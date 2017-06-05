import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Router} from '@angular/router';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {

  constructor(private http: Http, private router: Router) {
  }

  isAuthenticated() : boolean {
    return localStorage.getItem("currentUser") != null;
  }

  login(email: string, password: string) {
    return this.http.post('login', JSON.stringify({ email: email, password: password }))
        .map((response: Response) => {
          // login successful if there's a jwt token in the response
          let user = response.json();
          if (user && user.access_token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(["/"]);
  }

}