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
var HttpClient = (function () {
    function HttpClient(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.token = null;
    }
    HttpClient.prototype.setToken = function (token) {
        this.token = token;
        if (token) {
            this.headers.append('x-access-token', token);
        }
    };
    HttpClient.prototype.deleteToken = function () {
        this.headers.delete('x-access-token');
    };
    HttpClient.prototype.get = function (url) {
        return this.http.get(url, {
            headers: this.headers,
            withCredentials: true
        });
    };
    HttpClient.prototype.post = function (url, data) {
        //let headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post(url, data, {
            headers: this.headers,
            withCredentials: true
        });
    };
    return HttpClient;
}());
HttpClient = __decorate([
    core_1.Injectable()
], HttpClient);
exports.HttpClient = HttpClient;
