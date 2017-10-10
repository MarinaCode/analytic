import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Subject, Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { HttpClient } from './http.client';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
declare const FB: any;

@Injectable()
export class AuthenticationService {
  public token: string;
  authSub: Subscription;
  private headers = new Headers({'Content-Type': 'application/json'});
  private serverUrl = environment.apiUrl;  // URL to web api

  constructor(private http: HttpClient) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser;
  }

  loggedIn() {
    return localStorage.getItem('currentUser') != null;
  }

  loginFacebook(): Observable<any> {
    let user = this.http.get(this.serverUrl + '/users/facebook')
      .map(mapUser=> {
        console.log(mapUser);
      });
    return user;
  }

  authenticated():Observable<any> {
    return this.http.get(this.serverUrl + 'users/authenticated')
      .map((response:any) => {
        return response._body !="" ? response.json() : null;
      })
  }

  login(username, password): Observable<any> {
    return this.http.post(this.serverUrl + 'users/authenticate', JSON.stringify({ email: username, password: password }))
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response.json();
        if (token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(token));
          // return true to indicate successful login
          return token;
        } else {
          // return false to indicate failed login
          return false;
        }
      }).catch(error => error)
  }

  logoutFromStorage() {
    localStorage.removeItem('currentUser');
  }

  logout(): Observable<void> {
    return this.http.post(this.serverUrl + 'users/logout', null)
      .map((response: Response) => {
        // clear token remove user from local storage to log user out
        this.token = null;
        this.http.deleteToken();
        localStorage.removeItem('currentUser');
    });
  }
}
