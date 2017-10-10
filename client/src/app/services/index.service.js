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
require("rxjs/add/operator/toPromise");
var _ = require("underscore.string");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/catch");
var Params = (function () {
    function Params(data) {
        this.data = data;
    }
    Params.create = function (data) {
        return new Params(data);
    };
    return Params;
}());
exports.Params = Params;
var IndexService = (function () {
    function IndexService(http) {
        var _this = this;
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.serverUrl = 'http://localhost:3000/analytic/api/v1/'; // URL to web api
        this.notifierSubject = new Rx_1.Subject();
        this.progress$ = Rx_1.Observable.create(function (observer) {
            _this.progressObserver = observer;
        }).share();
    }
    IndexService.prototype.notify = function (something) {
        this.notifierSubject.next(something);
    };
    /**
     *
     * @param userId
     * @returns {Promise<*>|Promise<T>|Promise<R>|Promise<*|T>|Observable<R>|any}
       */
    IndexService.prototype.getSitesByUserId = function (params) {
        return this.http.post(this.serverUrl + "sites/getSitesByUserId", JSON.stringify({ limit: params.limit, skip: params.skip, str: params.str }))
            .toPromise()
            .then(function (response) {
            return response.json();
        }).catch(this.handleError);
    };
    IndexService.prototype.deleteData = function (id) {
        return this.http.post(this.serverUrl + "sites/deleteData", JSON.stringify({ id: id }))
            .toPromise()
            .then(function (response) {
            return response.json();
        }).catch(this.handleError);
    };
    IndexService.prototype.getSiteByUser = function (siteId, userId) {
        return this.http.post(this.serverUrl + "sites/getSiteByUser", JSON.stringify({ userId: userId, siteId: siteId }))
            .toPromise()
            .then(function (response) {
            return response.json();
        }).catch(this.handleError);
    };
    IndexService.prototype.getUserById = function () {
        return this.http.get(this.serverUrl + "users/getUserById")
            .map(function (response) {
            return response.json();
        });
    };
    IndexService.prototype.getAllData = function (url, mainUrl, path) {
        return Rx_1.Observable.forkJoin(this.http.post(this.serverUrl + "sites/getSiteMap", JSON.stringify({ url: mainUrl + '/sitemap.xml', mainUrl: mainUrl })).map(function (response) { return response.json().body; }), this.http.post(this.serverUrl + "sites/getDescriptionFromGoogle", JSON.stringify({ url: path })).map(function (response) { return response.json().body; }), this.http.post(this.serverUrl + "sites/getRobotData", JSON.stringify({ url: mainUrl + '/robots.txt' })).map(function (response) { return response.json().body; }), this.http.post(this.serverUrl + "sites/requestToSites", JSON.stringify({ url: mainUrl })).map(function (response) { return response.json().time; }), this.http.post(this.serverUrl + "sites/getScreenShot", JSON.stringify({ url: mainUrl })).map(function (response) { return response.json(); }));
    };
    IndexService.prototype.getExecutionTIme = function (url) {
        return this.http.post(this.serverUrl + "getExecutionTIme", JSON.stringify({ url: url }))
            .map(function (response) {
        });
    };
    IndexService.prototype.updateScore = function (average, siteId) {
        return this.http.post(this.serverUrl + "updateScore", JSON.stringify({ score: average, siteId: siteId }))
            .toPromise()
            .then(function (response) {
            return response.json();
        }).catch(this.handleError);
    };
    IndexService.prototype.activateEmail = function (id) {
        return this.http.get(this.serverUrl + "users/activateEmail/" + id)
            .map(function (response) {
            return response.json();
        })
            .catch(function (error) {
            return error;
        });
    };
    IndexService.prototype.check = function (url) {
        var _this = this;
        return this.http.post(this.serverUrl + "sites/check", JSON.stringify({ url: url }))
            .map(function (response) {
            var result = response.json().body;
            var domain = _this.getDomain(url).str;
            var mainUrl = _this.getDomain(url).mainUrl;
            var content = response.json().header;
            var xssProtection = content['x-xss-protection'] ? content['x-xss-protection'] : null;
            var contentSecurityPolicy = content['content-security-policy'] ? content['content-security-policy'] : null;
            var caching = content['cache-control'] ? content['cache-control'] : '';
            var contentLength = content['content-length'] ? content['content-length'] : '';
            var result = response.json().body;
            var domain = _this.getDomain(url).str;
            var mainUrl = _this.getDomain(url).mainUrl;
            var content = response.json().header;
            var xssProtection = content['x-xss-protection'] ? content['x-xss-protection'] : null;
            var contentSecurityPolicy = content['content-security-policy'] ? content['content-security-policy'] : null;
            var currentData = {
                result: result,
                domain: domain,
                url: url,
                mainUrl: _this.deletSlash(mainUrl),
                content: content["content-type"],
                xssProtection: xssProtection,
                contentSecurityPolicy: contentSecurityPolicy,
                contentLength: contentLength
            };
            return currentData;
        }).catch(function (error) {
            return error;
        });
    };
    //TODO
    IndexService.prototype.saveUser = function (body) {
        return this.http.post(this.serverUrl + "users/saveUser", JSON.stringify({ body: body }))
            .toPromise()
            .then(function (response) {
            var result = response.json();
            return result;
        }).catch(this.handleError);
    };
    IndexService.prototype.updateUserData = function (data) {
        return this.http.post(this.serverUrl + "users/updateUserData", JSON.stringify({ body: data }))
            .map(function (response) { return response; });
    };
    IndexService.prototype.updatePassword = function (data) {
        return this.http.post(this.serverUrl + "users/updatePassword", JSON.stringify({ body: data }))
            .map(function (response) { return response; });
    };
    IndexService.prototype.createUser = function (body) {
        return this.http.post(this.serverUrl + "users/createUser", JSON.stringify({ body: body }))
            .toPromise()
            .then(function (response) {
            var result = response.json();
            return result;
        }).catch(this.handleError);
    };
    IndexService.prototype.resetPass = function (data) {
        return this.http.post(this.serverUrl + "users/resetPassword", JSON.stringify({ body: data }))
            .toPromise()
            .then(function (response) {
            var result = response.json();
            return result;
        }).catch(this.handleError);
    };
    IndexService.prototype.makeFileRequest = function (url, params, files) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            var formData = new FormData(), xhr = new XMLHttpRequest();
            if (files) {
                for (var i = 0; i < files.length; i++) {
                    formData.append("file", files[i], files[i].name);
                }
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };
            xhr.upload.onprogress = function (event) {
                _this.progress = Math.round(event.loaded / event.total * 100);
                _this.progressObserver.next(_this.progress);
            };
            xhr.open('POST', url, true);
            xhr.withCredentials = true;
            xhr.send(formData);
        });
    };
    IndexService.prototype.updateUser = function (body) {
        var form = new http_1.URLSearchParams();
        for (var i = 0; i < body.files.length; i++) {
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
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.serverUrl + "users/updateUser", form.toString())
            .toPromise()
            .then(function (response) {
            var result = response.json();
        }).catch(this.handleError);
    };
    IndexService.prototype.requestToSites = function (sites) {
        var _this = this;
        var observablesData = [];
        for (var i = 0; i < sites.length; i++) {
            observablesData.push(this.http.post(this.serverUrl + "sites/requestToSites", JSON.stringify({ el: sites[i] })).map(function (response) {
                return _this.createDOM(response.json().body);
            }));
        }
        return Rx_1.Observable.forkJoin(observablesData);
    };
    IndexService.prototype.fingGoogle = function (groupedArr) {
        var _this = this;
        var observablesData = [];
        for (var i = 0; i < groupedArr.length; i++) {
            observablesData.push(this.http.post(this.serverUrl + "sites/fingGoogle", JSON.stringify({ el: groupedArr[i] })).map(function (response) {
                return _this.createDOM(response.json().body);
            }));
        }
        return Rx_1.Observable.forkJoin(observablesData);
    };
    IndexService.prototype.stringToEl = function (string) {
        var parser = new DOMParser(), content = 'text/html', DOM = parser.parseFromString(string, content);
        return DOM.body.childNodes[0];
    };
    IndexService.prototype.createDOM = function (dom) {
        return this.stringToEl(dom).ownerDocument;
    };
    IndexService.prototype.getRobotData = function (url) {
        return this.http.post(this.serverUrl + "sites/getRobotData", JSON.stringify({ url: url }))
            .toPromise()
            .then(function (response) { return response.json().body; })
            .catch(this.handleError);
    };
    IndexService.prototype.getWhois = function (url) {
        return this.http.post(this.serverUrl + "sites/getWhois", JSON.stringify({ url: url }))
            .toPromise()
            .then(function (response) { return response.json().body; })
            .catch(this.handleError);
    };
    IndexService.prototype.getSitemap = function (url, mainUrl) {
        return this.http.post(this.serverUrl + "sites/getSiteMap", JSON.stringify({ url: url, mainUrl: mainUrl }))
            .toPromise()
            .then(function (response) { return response.json().body; })
            .catch(this.handleError);
    };
    IndexService.prototype.getDescriptionFromGoogle = function (url) {
        return this.http.post(this.serverUrl + "sites/getDescriptionFromGoogle", JSON.stringify({ url: url }))
            .toPromise()
            .then(function (response) { return response.json().body; })
            .catch(this.handleError);
    };
    IndexService.prototype.handleError = function (error) {
        return Promise.reject(error.message || error);
    };
    //TODO
    IndexService.prototype.getDomain = function (url) {
        var r = ('' + url).match(/^(https?:)?\/\/[^/]+/i);
        var str = '';
        if (r[0].includes(r[1] + "//www.")) {
            str = r[0].slice(r[1].length + 6);
        }
        else if (r[0].includes(r[1] + "//")) {
            str = r[0].slice(r[1].length + 2);
        }
        return {
            str: str,
            mainUrl: r[0]
        };
    };
    ;
    IndexService.prototype.deletSlash = function (url) {
        var stringLength = url.length; // this will be 16
        var lastChar = url.charAt(stringLength - 1); // this will be the string "."
        url = lastChar == "/" ? url.slice(lastChar, -1) : url;
        return url;
    };
    IndexService.prototype.saveData = function (allData, domain) {
        return this.http.post(this.serverUrl + "sites/saveData", JSON.stringify({ data: allData, domain: domain }))
            .map(function (response) { return response; });
    };
    return IndexService;
}());
IndexService = __decorate([
    core_1.Injectable()
], IndexService);
exports.IndexService = IndexService;
