"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Marina on 16.12.2016.
 */
var core_1 = require("@angular/core");
var login_component_1 = require("../login/login.component");
var IndexComponent = (function () {
    function IndexComponent(indexService, router, authService) {
        this.indexService = indexService;
        this.router = router;
        this.authService = authService;
        this.url = "";
    }
    IndexComponent.prototype.check = function (url) {
        if (localStorage.length <= 0) {
            this.loginCmp.loginPopup(true);
        }
        else {
            this.isMasked = true;
            this.indexService.notify(url);
            this.isMasked = false;
        }
    };
    IndexComponent.prototype.ngOnInit = function () {
        this.isMasked = false;
    };
    return IndexComponent;
}());
__decorate([
    core_1.ViewChild(login_component_1.LoginComponent)
], IndexComponent.prototype, "loginCmp", void 0);
IndexComponent = __decorate([
    core_1.Component({
        selector: 'app-index',
        templateUrl: './index.component.html',
        styleUrls: ['./index.component.css', './index.component.scss']
    })
], IndexComponent);
exports.IndexComponent = IndexComponent;
