"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _ = require("underscore.string");
// var striptags = require('striptags');
var PerformanceComponent = (function () {
    function PerformanceComponent(indexService, route) {
        this.indexService = indexService;
        this.route = route;
        this.performanceScore = {
            good: 0,
            bad: 0,
            perfect: 0,
            caching: null,
            inlineClass: 0,
            inlineStyles: null,
            cachingClass: 0,
            scriptClass: 0,
            locatedCriptsClass: 0,
            stylesClass: 0,
            realScriptsPercent: 0,
            realStylePercent: 0,
            locatedScripts: 0,
            contentLength: 0,
            contentLengthClass: 0,
            time: 0,
            timeClass: 0
        };
    }
    PerformanceComponent.prototype.ngOnInit = function () {
        var data = this.siteData;
        this.url = data.url;
        this.mainUrl = data.mainUrl;
        this.performanceScore = data.performanceScore;
        this.contentLength = data.performanceScore.contentLength;
        this.contentLengthClass = data.performanceScore.contentLengthClass;
        this.time = data.performanceScore.time;
        this.timeClass = data.performanceScore.timeClass;
    };
    return PerformanceComponent;
}());
__decorate([
    core_1.Input()
], PerformanceComponent.prototype, "siteData", void 0);
PerformanceComponent = __decorate([
    core_1.Component({
        selector: 'app-performance',
        templateUrl: './performance.component.html',
        styleUrls: ['./performance.component.css'],
    })
], PerformanceComponent);
exports.PerformanceComponent = PerformanceComponent;
