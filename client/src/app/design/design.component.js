"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DesignComponent = (function () {
    function DesignComponent(indexService, route) {
        this.indexService = indexService;
        this.route = route;
        this.designScore = {
            protectClass: 0,
            swfClass: 0,
            frameClass: 0,
            contetntSecureClass: 0,
            commentClass: 0,
            doctypeClass: 0,
            charsetClass: 0,
            tableClass: 0,
            headerInfo: null,
            tables: [],
            getFrames: [],
            swfs: [],
            comments: []
        };
    }
    DesignComponent.prototype.ngOnInit = function () {
        var data = this.siteData;
        var allDom = data.allDom;
        this.url = data.url;
        this.mainUrl = data.mainUrl;
        this.designScore = data.designScore;
        this.doc = {
            doctype: this.designScore.headerInfo.html,
            htmlVersion: this.designScore.headerInfo.str,
            content: data.content,
            xssProtection: data.xssProtection ? data.xssProtection : null,
            contentSecurityPolicy: data.contentSecurityPolicy ? data.contentSecurityPolicy : null,
        };
        this.emails = this.findEmail(data.result);
        if (this.emails) {
            this.emaiClass == 0;
        }
    };
    DesignComponent.prototype.findEmail = function (dom) {
        var email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        return dom.match(email);
    };
    return DesignComponent;
}());
__decorate([
    core_1.Input()
], DesignComponent.prototype, "siteData", void 0);
DesignComponent = __decorate([
    core_1.Component({
        selector: 'app-design',
        templateUrl: './design.component.html',
        styleUrls: ['./design.component.css']
    })
], DesignComponent);
exports.DesignComponent = DesignComponent;
