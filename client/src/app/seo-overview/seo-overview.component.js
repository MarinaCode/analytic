"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _ = require('underscore');
var striptags = require('striptags');
var SeoOverviewComponent = (function () {
    function SeoOverviewComponent(indexService, route) {
        this.indexService = indexService;
        this.route = route;
        this.scoreObj = {
            perfect: 0,
            good: 0,
            bad: 0
        };
        this.seoScore = {
            follow: null,
            followPercentClass: 0,
            nonUnderscorePercentClass: 0,
            nonUnderscorePercent: 0,
            metaDescription: null,
            metaDescriptionClass: 0,
            descriptionCount: 0,
            correctLinkClass: 0,
            alternativeClass: 0,
            canonicalClass: 0,
            canonicalURL: null,
            siteMapClass: 0,
            metaRobotTextClass: 0,
            metaRobotClass: 0,
            robotsText: null,
            siteMapXML: null,
            robotsTextLength: 0,
            metaDataClass: 0,
            titleClass: 0,
            followData: [],
            metaData: [],
            correctLinks: [],
            linkJuiceClass: 0,
            internal: 0,
            external: 0,
            allLinks: 0,
            externalPercent: 0,
            alternativeTextCount: 0,
            alternative: null,
            allLinksCount: 0,
            followPercent: 0,
            nonUnderscoreCount: 0,
            noFollow: null
        };
    }
    SeoOverviewComponent.prototype.ngOnInit = function () {
        var data = this.siteData;
        var allDom = data.allDom;
        this.url = data.url;
        this.mainUrl = data.mainUrl;
        this.domain = data.domain;
        this.seoScore = data.seoScore;
        this.title = this.seoScore.title;
        this.titleCount = this.seoScore.titleCount;
        this.titleClass = this.seoScore.titleClass;
        this.metaDescription = this.seoScore.metaDescription;
        this.metaDescriptionClass = this.seoScore.metaDescriptionClass;
        this.descriptionCount = this.seoScore.descriptionCount;
        this.metaDataClass = this.seoScore.metaDataClass;
        this.isMetaRobotExist = this.seoScore.isMetaRobotExist;
        this.metaRobotClass = this.seoScore.metaRobotClass;
        this.metaRobotTextClass = this.seoScore.metaRobotTextClass;
        this.canonicalURL = this.seoScore.canonicalURL;
        this.canonicalClass = this.seoScore.canonicalClass;
        this.alternative = this.seoScore.alternative;
        this.alternativeClass = this.seoScore.alternativeClass;
        this.alternativeTextCount = this.seoScore.alternativeTextCount;
        this.allLinksCount = this.seoScore.allLinksCount;
        this.follow = this.seoScore.follow;
        var followData = this.seoScore.followData;
        var googleDescription = this.stripTags(data.googleResult);
        this.resultLong = this.sliceString(googleDescription, 160);
        this.resultShort = this.sliceString(googleDescription, 120);
        this.metaData = this.seoScore.metaData;
        this.metaRobotTextClass = this.metaRobotTextClass;
        this.robotsText = this.seoScore.robotsText;
        this.siteMapClass = this.seoScore.siteMapClass;
        this.siteMapXML = this.seoScore.siteMapXML;
        this.nonUnderscorePercent = this.seoScore.nonUnderscorePercent;
        this.nonUnderscorePercentClass = this.seoScore.nonUnderscorePercentClass;
        this.nonUnderscoreCount = this.seoScore.nonUnderscoreCount;
        this.noFollow = this.seoScore.noFollow;
        this.allLinks = this.seoScore.allLinks;
        this.options = {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                width: '400',
                height: '300'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            credits: {
                enabled: false
            },
            title: { text: '' },
            series: [{
                    colorByPoint: true,
                    data: [{
                            name: 'Internal Links',
                            y: followData.allLinks.length - followData.external
                        }, {
                            name: 'External Links',
                            y: followData.external,
                            sliced: true,
                            selected: true
                        }, {
                            name: 'Nofollow Link',
                            y: followData.noFollow
                        }]
                }]
        };
        // Here is
        this.internal = this.seoScore.internal;
        this.external = this.seoScore.external;
        this.externalPercent = this.seoScore.externalPercent;
        this.followPercent = this.seoScore.followPercent;
        this.followPercentClass = this.seoScore.followPercentClass;
    };
    SeoOverviewComponent.prototype.stripTags = function (dom) {
        var el = this.createDOM(dom);
        var getSpan = el.getElementsByClassName("st");
        var strips = getSpan.length > 0 ? striptags(getSpan[0].innerHTML) : '';
        return strips;
    };
    SeoOverviewComponent.prototype.createDOM = function (dom) {
        var el = document.createElement('html');
        el.innerHTML = dom;
        return el;
    };
    SeoOverviewComponent.prototype.sliceString = function (el, count) {
        return el != null && el.length > 0 ? el.slice(0, count) : '';
    };
    SeoOverviewComponent.prototype.show = function (event) {
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
    return SeoOverviewComponent;
}());
__decorate([
    core_1.Input()
], SeoOverviewComponent.prototype, "siteData", void 0);
SeoOverviewComponent = __decorate([
    core_1.Component({
        selector: 'app-seo-overview',
        templateUrl: './seo-overview.component.html',
        styleUrls: ['./seo-overview.component.css']
    })
], SeoOverviewComponent);
exports.SeoOverviewComponent = SeoOverviewComponent;
