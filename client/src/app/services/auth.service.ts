import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Router} from '@angular/router';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {User} from "../user/user";

@Injectable()
export class AuthService {

  currentUser: any;

  constructor(private http: Http, private router: Router) {
    let localStorageUser = localStorage.getItem("currentUser");
    if (localStorageUser) {
      this.currentUser = JSON.parse(localStorageUser);
    }
  }

  isAuthenticated() : boolean {
    return localStorage.getItem("currentUser") != null;
  }

  hasRole(roles: any[]) : boolean {
    let currentUser = this.currentUser;
    if (currentUser) {
      let userRoles = currentUser.roles;
      if (userRoles) {
        for (var i = 0; i < roles.length; i++) {
          for (var j = 0; j < userRoles.length; j++) {
            if (roles[i] === userRoles[j]) {
              return true;
            }
          }
        }
        return false;
      }
    }
  }

  login(email: string, password: string) {
    /*return this.http.post('login', JSON.stringify({ email: email, password: password }))
        .map((response: Response) => {
          // login successful if there's a jwt token in the response
          let user = response.json();
          if (user && user.access_token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.http.get('user/current').map((r: Response) => {
              let user = new User(r.json())
              this.currentUser.userDetails = user;
              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            });
          }
        });*/

    return this.http.post('login', JSON.stringify({ email: email, password: password }))
        .map((response: Response) => {
          // login successful if there's a jwt token in the response
          let user = response.json();
          if (user && user.access_token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return this.currentUser;
        }).flatMap((user) => {
            return this.http.get('user/currenta').map((r: Response) => {
              let userDetails = new User(r.json())
              this.currentUser.userDetails = userDetails;
              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            });
        });

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(["/"]);
  }

}