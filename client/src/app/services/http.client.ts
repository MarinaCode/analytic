import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class HttpClient {
  headers:Headers;
  token: any;

  constructor(private http: Http) {
    this.headers = new Headers({'Content-Type': 'application/json'});
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      this.headers.append('x-access-token', token);
    }
  }

  deleteToken() {
    this.headers.delete('x-access-token');
  }

  get(url) {

    return this.http.get(url, {
      headers: this.headers,
      withCredentials: true
    });
  }

  post(url, data) {
    //let headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post(url, data, {
      headers: this.headers,
      withCredentials: true
    });
  }
}
