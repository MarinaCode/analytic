import { Injectable }    from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
var _ = require("underscore.string");
import {Subject, Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import * as Rx from "rxjs/Rx"
import { AuthenticationService }   from '../services/authentication.service';
import { HttpClient } from './http.client';
import { environment } from '../../environments/environment';
@Injectable()
export class IndexService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private serverUrl = environment.apiUrl;  // URL to web api
  public notifierSubjectCheckUrl: any = new Subject();
  public notifierSubjectPagination: any = new Subject();
  public notifierSubjectUpdateImage: any = new Subject();
  public notifierSubjectUserChange: any = new Subject();
  data: Object;
  progress:any;
  uniqueData: Object;
  progress$: any;
  progressObserver: any;
  private getDataSubject: Rx.Subject<any>;
  constructor(private http: HttpClient ) {
    this.progress$ = Observable.create(observer => {
      this.progressObserver = observer
    }).share();
  }

  public notifyCheckUrl(something: any) {
    this.notifierSubjectCheckUrl.next(something);
  }

  public notifyPagination() {
    this.notifierSubjectPagination.next();
  }

  public notifyUpdateImage(image: any) {
    this.notifierSubjectUpdateImage.next(image);
  }

  public notifyUserChange(something: any) {
    this.notifierSubjectUserChange.next(something);
  }
  /**
   *
   * @param userId
   * @returns {Promise<*>|Promise<T>|Promise<R>|Promise<*|T>|Observable<R>|any}
     */

  getSitesByUserId(params: any): Promise<any> {
    return this.http.post(this.serverUrl + "sites/getSitesByUserId", JSON.stringify({limit: params.limit, skip: params.skip, str: params.str}) )
      .toPromise()
      .then(response=> {
        return response.json();
      }).catch(this.handleError);
  }

  deleteData(id: number): Promise<any> {
    return this.http.post(this.serverUrl + "sites/deleteData", JSON.stringify({id: id}))
      .toPromise()
      .then(response=> {
        return response.json()
      }).catch(this.handleError);
  }

  getSiteByUser(siteId: number): Observable<any> {
    return this.http.post(this.serverUrl + "sites/getSiteByUser", JSON.stringify({siteId: siteId}))
      .map(response=> {
        return response.json();
      })
  }

  getUserById(): Observable<any> {
    return this.http.get(this.serverUrl + "users/getUserById")
      .map(response=> {
        return response.json();
      })
      .catch(this.handleError);
  }

  getAllData(url: string, mainUrl: string, path: string) : Observable<any> {
    return Observable.forkJoin(
      this.http.post(this.serverUrl + "sites/getSiteMap", JSON.stringify({url: mainUrl  + '/sitemap.xml' ,mainUrl: mainUrl})).map(response=> response.json().body),
      this.http.post(this.serverUrl + "sites/getDescriptionFromGoogle", JSON.stringify({url: path})).map(response=> response.json().body),
      this.http.post(this.serverUrl + "sites/getFavicon", JSON.stringify({url: mainUrl + '/favicon.ico'})).map(response=> response.json().body),
      this.http.post(this.serverUrl + "sites/getRobotData", JSON.stringify({url: mainUrl + '/robots.txt'})).map(response=> response.json().body),
      this.http.post(this.serverUrl + "sites/requestToSites", JSON.stringify({url: mainUrl})).map(response=> response.json().time),
      this.http.post(this.serverUrl + "sites/getScreenShot", JSON.stringify({url: mainUrl})).map(response=> response.json())
    )
  }

  getExecutionTIme(url: string) : Observable<any> {
    return this.http.post(this.serverUrl + "getExecutionTIme", JSON.stringify({url: url}))
      .map(response=> {
      });
  }

  updateScore(average: any, siteId:number ): Promise<any> {
    return this.http.post(this.serverUrl + "updateScore", JSON.stringify({score: average, siteId: siteId}))
      .toPromise()
      .then(response=> {
        return response.json();
      }).catch(this.handleError);
  }

  activateEmail(id): Observable<any> {
    return this.http.get(this.serverUrl + "users/activateEmail/" + id)
      .map(response=> {
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }

  check(url: string): Observable<any> {
    return this.http.post(this.serverUrl + "sites/check", JSON.stringify({url: url}))
      .map(response=> {
        var result =  response.json().body;
        var domain = this.getDomain(url).str;
        var mainUrl = this.getDomain(url).mainUrl;
        var content = response.json().header;
        var xssProtection= content['x-xss-protection'] ? content['x-xss-protection'] : null;
        var contentSecurityPolicy = content['content-security-policy'] ? content['content-security-policy'] : null;
        var caching = content['cache-control'] ? content['cache-control'] : '';
        var contentLength = content['content-length'] ? content['content-length'] : '';
        var result = response.json().body;
        var domain = this.getDomain(url).str;
        var mainUrl = this.getDomain(url).mainUrl;
        var content = response.json().header;
        var xssProtection = content['x-xss-protection'] ? content['x-xss-protection'] : null;
        var contentSecurityPolicy = content['content-security-policy'] ? content['content-security-policy'] : null;
        var currentData = {
          result: result,
          domain: domain,
          url: url,
          mainUrl: this.deletSlash(mainUrl),
          content: content["content-type"],
          xssProtection: xssProtection,
          contentSecurityPolicy: contentSecurityPolicy,
          contentLength:contentLength
        }
        return currentData;
      }).catch((error) => {
        return Observable.throw(error.json());
      });
  }

  //TODO
  saveUser(body: any, emailType: number): Promise<any> {
    return this.http.post(this.serverUrl + "users/saveUser", JSON.stringify({body: body, emailType: emailType}))
      .toPromise()
      .then(response=> {
        var result =  response.json();
        return result;
      }).catch(this.handleError);
  }

  updateUserData(data: any): Observable<any> {
    return this.http.post(this.serverUrl + "users/updateUserData", JSON.stringify({body: data}))
      .map(response=> response)
  }

  updatePassword(data: any): Observable<any> {
    return this.http.post(this.serverUrl + "users/updatePassword", JSON.stringify({body: data}))
      .map(response=> response)
  }

  createDemoUser(): Observable<any> {
    return this.http.post(this.serverUrl + "users/createDemoUser", null)
      .map(response=> response.json());
  }

  createUser(body: any): Promise<any> {
    return this.http.post(this.serverUrl + "users/createUser", JSON.stringify({body: body}))
      .toPromise()
      .then(response=> {
        var result =  response.json();
        return result;
      }).catch(this.handleError);
  }

  verifyPasswordCode(id: string): Observable<any> {
    return this.http.get(this.serverUrl + "users/verifyPasswordCode/" + id)
      .map(response=> {
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }

  changePasswordByCode(password, confirmPassword, reset_password_code): Observable<any> {
    return this.http.post(this.serverUrl + "users/changePasswordByCode", JSON.stringify({password: password, confirmPassword: confirmPassword, reset_password_code: reset_password_code}))
      .map(response=> {
        var result = response.json();
        return result;
      })
      .catch((error) => {
        return error;
      });
  }

  contactUs(email, username, subject, message): Observable<any> {
    return this.http.post(this.serverUrl + "users/contactUs", JSON.stringify({email: email, username: username, subject: subject, message: message }))
      .map(response=> {
        var result = response.json();
        return result;
      })
  }

  resetPass(data: any): Promise<any> {
    return this.http.post(this.serverUrl + "users/resetPassword", JSON.stringify({body: data}))
      .toPromise()
      .then(response=> {
        var result = response.json();
        return result;
      });
  }

  makeFileRequest (url: string, params: any,  files: File[]): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData = new FormData(),xhr: XMLHttpRequest = new XMLHttpRequest();
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append("file", files[i], files[i].name);
        }
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        this.progress = Math.round(event.loaded / event.total * 100);

        this.progressObserver.next(this.progress);
      };

      xhr.open('POST', url, true);
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  }

  updateUser(body: any): Promise<any> {
    let form = new URLSearchParams();
    for (let i = 0; i < body.files.length; i++) {
      form.append("file", body.files[i]);
    }
    form.append("username", body.username);
    form.append("first_name", body.first_name);
    form.append("last_name", body.last_name);
    form.append("company", body.company);
    form.append("profession", body.profession);
    form.append("email", body.email);
    form.append("gender", body.gender);
    form.append("country", body.country);
    form.append("company", body.company);
    form.append("day", body.day);
    form.append("month", body.month);
    form.append("year", body.year);
    form.append("phone", body.phone);
    form.append("current", body.current);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.serverUrl + "users/updateUser", form.toString())
      .toPromise()
      .then(response=> {
        var result =  response.json();

      }).catch(this.handleError);
  }

  requestToSites(sites: Array<string>) {
    var observablesData = [];
    for (var i = 0; i < sites.length; i++) {
      observablesData.push( this.http.post(this.serverUrl + "sites/requestToSites", JSON.stringify({el: sites[i]})).map(response => {
        return this.createDOM(response.json().body)
      }));
    }
    return Observable.forkJoin(observablesData);
  }


  fingGoogle(groupedArr: Array<string>) {
    var observablesData = [];
    for (var i = 0; i < groupedArr.length; i++) {
      observablesData.push( this.http.post(this.serverUrl + "sites/fingGoogle", JSON.stringify({el: groupedArr[i]})).map(response => {
        return this.createDOM(response.json().body)
      }));
    }
    return Observable.forkJoin(observablesData);
  }

  stringToEl(string) {
    var parser = new DOMParser(),
      content = 'text/html',
      DOM = parser.parseFromString(string, content);
    return DOM.body.childNodes[0];
  }

  createDOM(dom: any) {
    return this.stringToEl(dom).ownerDocument;
  }

  getRobotData(url: string): Promise<any> {
    return this.http.post(this.serverUrl + "sites/getRobotData", JSON.stringify({url: url}))
      .toPromise()
      .then(response=> response.json().body)
      .catch(this.handleError);
  }

  getWhois(url: string): Promise<any> {
    return this.http.post(this.serverUrl + "sites/getWhois", JSON.stringify({url: url}))
      .toPromise()
      .then(response=> response.json().body)
      .catch(this.handleError);
  }

  getSitemap(url: string, mainUrl: string): Promise<any> {
    return this.http.post(this.serverUrl + "sites/getSiteMap", JSON.stringify({url: url,mainUrl: mainUrl}))
      .toPromise()
      .then(response=> response.json().body)
      .catch(this.handleError);
  }

  getDescriptionFromGoogle(url: string): Promise<any> {
    return this.http.post(this.serverUrl + "sites/getDescriptionFromGoogle", JSON.stringify({url: url}))
      .toPromise()
      .then(response=> response.json().body)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  //TODO
  private getDomain(url) {
    var r = ('' + url).match(/^(https?:)?\/\/[^/]+/i);
    var str = '';
     if(r[0].includes(r[1] + "//www.")) {
      str =  r[0].slice(r[1].length + 6);
     } else if(r[0].includes(r[1]+"//")) {
      str =  r[0].slice(r[1].length + 2);
     }
    return {
      str: str,
      mainUrl: r[0]
    };
  };

  private deletSlash(url: any) {
    var stringLength = url.length; // this will be 16
    var lastChar = url.charAt(stringLength - 1); // this will be the string "."
    url = lastChar == "/" ?  url.slice(lastChar, -1) :  url;
    return  url;
  }

  public saveData(allData, domain): Observable<any>{
    return this.http.post(this.serverUrl + "sites/saveData", JSON.stringify({data: allData, domain: domain}))
      .map(response=> response)
  }
}
