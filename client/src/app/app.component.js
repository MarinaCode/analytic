"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var error_message_component_1 = require("./error-message/error-message.component");
var AppComponent = (function () {
    function AppComponent(_translate, indexService, router) {
        var _this = this;
        this._translate = _translate;
        this.indexService = indexService;
        this.router = router;
        this._translate.use('en');
        this.indexService.notifierSubject.subscribe(function (url) { _this.check(url); });
    }
    AppComponent.prototype.check = function (url) {
        var _this = this;
        var valid = this.checkURL(url);
        var data = {};
        var mainUrl = "";
        var domain = "";
        if (valid) {
            this.isMasked = true;
            this.indexService.check(url).subscribe(function (result) {
                data = result;
                mainUrl = result.mainUrl;
                domain = result.domain;
                var path = "https://www.google.com/search?q=" + encodeURIComponent(mainUrl);
                _this.indexService.getAllData(url, mainUrl, path).subscribe(function (allResult) {
                    data.siteMapResult = allResult[0];
                    data.googleResult = allResult[1];
                    data.robotResult = allResult[2];
                    data.time = allResult[3];
                    data.screenShot = allResult[4].result;
                    data.fullUrl = url;
                    var getDate = new Date();
                    var day = getDate.getDate();
                    var month = getDate.getMonth() + 1;
                    var year = getDate.getFullYear();
                    data.lastCheck = day + ":" + month + ":" + year;
                    _this.indexService.saveData(data, domain).subscribe(function (res) {
                        _this.router.navigate(['/page-analysis/' + res.json().id, { allowSave: true }]);
                        _this.isMasked = false;
                    });
                });
            }, function (err) {
                _this.isMasked = false;
                _this.errorMsg.showErrorMessage("Oops !!! An error occured.Please enter a valid url.");
            });
        }
        else {
            this.isMasked = false;
            this.errorMsg.showErrorMessage("Oops !!! An error occured.Please enter a valid url.");
        }
    };
    AppComponent.prototype.checkURL = function (url) {
        var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        return valid;
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild(error_message_component_1.ErrorMessageComponent)
], AppComponent.prototype, "errorMsg", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: 'app.component.html',
        styleUrls: ['app.component.css']
    })
], AppComponent);
exports.AppComponent = AppComponent;
