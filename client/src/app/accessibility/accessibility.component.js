"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AccessibilityComponent = (function () {
    function AccessibilityComponent(indexService, route) {
        this.indexService = indexService;
        this.route = route;
        this.accessibilityScore = {
            good: 0,
            bad: 0,
            perfect: 0,
            checkUrlForClean: null,
            domain: '',
            script_: false,
            getNoScript: false,
            getBgSound: false,
            favicon: false,
            getHTMLLang: null,
            openGraph: null,
            publisher: '',
            viewPort: 0,
        };
    }
    AccessibilityComponent.prototype.ngOnInit = function () {
        var data = this.siteData;
        this.accessibilityScore = data.accessibilityScore;
        this.checkUrlForClean = this.accessibilityScore.checkUrlForClean;
        this.domain = this.accessibilityScore.domain;
        this.script_ = this.accessibilityScore.script_;
        this.getNoScript = this.accessibilityScore.getNoScript;
        this.getBgSound = this.accessibilityScore.getBgSound;
        this.favicon = this.accessibilityScore.favicon;
        this.getHTMLLang = this.accessibilityScore.getHTMLLang;
        var openGraph = this.accessibilityScore.openGraph;
        this.ogDescription = openGraph['og:description'];
        this.ogImage = openGraph['og:image'];
        this.ogSite_name = openGraph['og:site_name'];
        this.ogTitle = openGraph['og:title'];
        this.ogType = openGraph['og:type'];
        this.ogUrl = openGraph['og:url'];
        var twitterCard = this.accessibilityScore.getTwitterCard;
        this.twitterDescription = twitterCard['twitter:description'];
        this.twitterTitle = twitterCard['twitter:title'];
        this.twitterImage = twitterCard['twitter:image'];
        this.twitterCard = twitterCard['twitter:card'];
        this.publisher = this.accessibilityScore.getPublisher ? this.accessibilityScore.getPublisher : false;
        this.viewPort = this.accessibilityScore.viewPort;
    };
    return AccessibilityComponent;
}());
__decorate([
    core_1.Input()
], AccessibilityComponent.prototype, "siteData", void 0);
AccessibilityComponent = __decorate([
    core_1.Component({
        selector: 'app-accessibility',
        templateUrl: './accessibility.component.html',
        styleUrls: ['./accessibility.component.css']
    })
], AccessibilityComponent);
exports.AccessibilityComponent = AccessibilityComponent;
