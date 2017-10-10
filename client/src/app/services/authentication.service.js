"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/catch");
var AuthenticationService = (function () {
    function AuthenticationService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.serverUrl = 'http://localhost:3000/analytic/api/v1/'; // URL to web api
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser;
    }
    AuthenticationService.prototype.loggedIn = function () {
        return localStorage.getItem('currentUser') != null;
    };
    AuthenticationService.prototype.loginFacebook = function () {
        var user = this.http.get(this.serverUrl + '/users/facebook')
            .map(function (mapUser) {
            console.log(mapUser);
        });
        return user;
    };
    AuthenticationService.prototype.authenticated = function () {
        return this.http.get(this.serverUrl + 'users/authenticated')
            .map(function (response) {
            return response._body != "" ? response.json() : null;
        });
    };
    AuthenticationService.prototype.login = function (username, password) {
        return this.http.post(this.serverUrl + 'users/authenticate', JSON.stringify({ email: username, password: password }))
            .map(function (response) {
            // login successful if there's a jwt token in the response
            var token = response.json();
            if (token) {
                // store username and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify({ username: token }));
                // return true to indicate successful login
                return true;
            }
            else {
                // return false to indicate failed login
                return false;
            }
        }).catch(function (error) {
            return error;
        });
    };
    AuthenticationService.prototype.logout = function () {
        var _this = this;
        return this.http.post(this.serverUrl + 'users/logout', null)
            .map(function (response) {
            // clear token remove user from local storage to log user out
            _this.token = null;
            _this.http.deleteToken();
            localStorage.removeItem('currentUser');
        });
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    core_1.Injectable()
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
