"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// var sizeof = require('object-sizeof');
// var striptags = require('striptags');
// var _ = require("underscore");
var AnalysisContentComponent = (function () {
    function AnalysisContentComponent(indexService, route) {
        this.indexService = indexService;
        this.route = route;
        this.keywordCountArray1 = null;
        this.keywordCountArray2 = null;
        this.keywordCountArray3 = null;
        this.cloudData = [];
        this.contentScore = {
            percentsInText: 0,
            percentsInTextClass: 0,
            countInfo: 0,
            countInfoClass: 0,
            titleCohance: 0,
            titleCohanceClass: 0,
            keywordRepetition: 0,
            quantityKeyword: 0,
            microdataArrayClass: 0,
            microdataArray: null,
            checkTitle: null,
            cloudData: null
        };
    }
    AnalysisContentComponent.prototype.ngOnInit = function () {
        var data = this.siteData;
        var allDom = data.allDom;
        this.url = data.url;
        this.contentScore = this.siteData.contentScore;
        this.cloudData = this.contentScore.cloudData;
        this.keywordCountArray1 = this.siteData.contentScore.keywordCountArray1;
        this.keywordCountArray2 = this.siteData.contentScore.keywordCountArray2;
        this.keywordCountArray3 = this.siteData.contentScore.keywordCountArray3;
    };
    AnalysisContentComponent.prototype.show = function (event) {
        event.preventDefault();
        if (event.currentTarget.nextElementSibling.style.display == "none") {
            event.currentTarget.nextElementSibling.style.display = "block";
            event.currentTarget.classList.add("active");
        }
        else {
            event.currentTarget.nextElementSibling.style.display = "none";
            event.currentTarget.classList.remove("active");
        }
    };
    return AnalysisContentComponent;
}());
__decorate([
    core_1.Input()
], AnalysisContentComponent.prototype, "siteData", void 0);
AnalysisContentComponent = __decorate([
    core_1.Component({
        selector: 'app-analysis-content',
        templateUrl: './analysis-content.component.html',
        styleUrls: ['./analysis-content.component.css']
    })
], AnalysisContentComponent);
exports.AnalysisContentComponent = AnalysisContentComponent;
