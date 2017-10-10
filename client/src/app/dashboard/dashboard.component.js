"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DashboardComponent = (function () {
    function DashboardComponent(indexService, authService, router, _translate) {
        this.indexService = indexService;
        this.authService = authService;
        this.router = router;
        this._translate = _translate;
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.authService.loggedIn()) {
            this.router.navigate(['/index']);
        }
        this.data = this.indexService.data;
        this.indexService.getUserById().subscribe(function (result) {
            var userInfo = result;
            _this.name = userInfo.first_name;
            _this.image = userInfo.image;
            _this.id = userInfo.id;
            _this.seoBalance = userInfo.seoTries;
            _this.checkerBalance = userInfo.checkerTries;
        });
    };
    DashboardComponent.prototype.isCurrentLang = function (lang) {
        return lang === this._translate.currentLang;
    };
    DashboardComponent.prototype.selectLang = function (lang) {
        this._translate.use(lang);
        //  this.refreshText();
    };
    DashboardComponent.prototype.demo = function () {
        introJs().start();
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css', './dashboard.component.scss'],
        encapsulation: core_1.ViewEncapsulation.None
    })
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
