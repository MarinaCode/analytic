"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var sizeof = require('object-sizeof');
var _ = require('underscore');
var utils_1 = require("../utils/utils");
var error_message_component_1 = require("../error-message/error-message.component");
// var striptags = require('striptags');
var PageAnalysisComponent = (function () {
    function PageAnalysisComponent(indexService, router, authService, route) {
        this.indexService = indexService;
        this.router = router;
        this.authService = authService;
        this.route = route;
        this.validPerformance = 0;
        this.validDesign = 0;
        this.validSeo = 0;
        this.validContent = 0;
        this.validAccessibility = 0;
        this.valid = 0;
        this.warning = 0;
        this.critical = 0;
    }
    PageAnalysisComponent.prototype.ngOnInit = function () {
        var _this = this;
        var self = this;
        this.problematicData = [];
        this.isMasked = true;
        this.sub = this.route.params.subscribe(function (params) {
            var userId = 1;
            var siteId = params['id'];
            var allowSave = params['allowSave'];
            _this.indexService.getSiteByUser(siteId, userId).then(function (result) {
                _this.siteData = JSON.parse(result.data);
                _this.siteData.allDom = _this.createDOM(_this.siteData.result);
                _this.siteData.performanceScore = _this.performanceScoreCount(_this.siteData);
                _this.siteData.designScore = _this.designScoreCount(_this.siteData);
                _this.siteData.seoScore = _this.seoScoreCount(_this.siteData);
                _this.siteData.contentScore = _this.contentScoreCount(_this.siteData);
                _this.siteData.accessibilityScore = _this.accessibilityScore(_this.siteData);
                _this.mainUrl = _this.siteData.mainUrl;
                _this.fullUrl = _this.siteData.url;
                _this.lastCheck = _this.siteData.lastCheck;
                _this.screenshot = "http://localhost:3000/images/" + _this.siteData.screenShot;
                _this.average = Math.ceil((_this.warning + _this.critical + _this.valid) / 3);
                if (allowSave) {
                    _this.indexService.updateScore(_this.average, siteId).then(function (result) {
                        _this.isMasked = false;
                    });
                }
                else {
                    _this.isMasked = false;
                }
            }).catch(function (e) {
                if (e.message) {
                    _this.router.navigate(['/index']);
                }
            });
            _this.isMasked = false;
        });
    };
    PageAnalysisComponent.prototype.seoScoreCount = function (data) {
        var allDom = data.allDom;
        var good = 0;
        var bad = 0;
        var perfect = 0;
        var titleClass = 0;
        var metaDescriptionClass = 0;
        var metaDataClass = 0;
        var metaRobotTextClass = 0;
        var siteMapClass = 0;
        var canonicalClass = 0;
        var alternativeClass = 0;
        var correctLinkClass = 0;
        var externalClass = 0;
        var linkJuiceClass = 0;
        var descriptionContent = this.findeContentDescription(allDom);
        var metaRobotClass = 0;
        //with functions
        var title = this.getTitle(allDom);
        var titleCount = title.length ? title.length : 0;
        var metaDescription = descriptionContent ? descriptionContent : '';
        var descriptionCount = metaDescription.length > 0 ? metaDescription.length : 0;
        var metaData = this.getAllMeta(allDom);
        var isMetaRobotExist = this.isExist('robots', this.getAllMeta(allDom));
        var robotsText = data.robotResult ? "<pre>" + data.robotResult + "</pre>" : '';
        var siteMapXML = data.siteMapResult ? '<pre>' + data.siteMapResult + '</pre>' : '';
        var alternativeCount = this.countAlternativeText(allDom);
        var canonicalURL = this.getCanonical(allDom) ? this.getCanonical(allDom) : null;
        var alternative = this.getImages(allDom);
        var correctLinks = this.checkProperLinksCount(allDom);
        var followData = this.getExternalLinks(allDom, data.domain);
        var external = followData.external;
        var internal = followData.allLinks.length - followData.external;
        var externalPercent = this.toCeil(external, followData.allLinks.length);
        if (utils_1.Utils.checkState(titleCount, 55, 65) == 0) {
            perfect++;
            titleClass = 0;
        }
        else if (utils_1.Utils.checkState(titleCount, 55, 65) == 1) {
            good++;
            titleClass = 1;
            this.problematicData.push('Problem with title');
        }
        else if (utils_1.Utils.checkState(titleCount, 55, 65) == 2) {
            bad++;
            titleClass = 2;
            this.problematicData.push('Problem with title');
        }
        if (utils_1.Utils.checkState(descriptionCount, 140, 170) == 0) {
            perfect++;
            metaDescriptionClass = 0;
        }
        else if (utils_1.Utils.checkState(descriptionCount, 140, 170) == 1) {
            good++;
            metaDescriptionClass = 1;
            this.problematicData.push('Problem with Meta Description');
        }
        else if (utils_1.Utils.checkState(descriptionCount, 140, 170) == 2) {
            bad++;
            metaDescriptionClass = 2;
            this.problematicData.push('Problem with Meta Description');
        }
        if (isMetaRobotExist) {
            perfect++;
            metaRobotClass = 0;
        }
        else {
            good++;
            metaRobotClass = 1;
            this.problematicData.push('Problem with meta data');
        }
        if (robotsText.length > 0) {
            perfect++;
            metaRobotTextClass = 0;
        }
        else {
            good++;
            metaRobotTextClass = 1;
            this.problematicData.push('Problem with robot');
        }
        if (external < internal) {
            perfect++;
            linkJuiceClass = 0;
        }
        else {
            bad++;
            linkJuiceClass = 2;
            this.problematicData.push('Problem with Link Juice');
        }
        if (externalPercent >= 90 && externalPercent <= 100) {
            perfect++;
            externalClass = 0;
        }
        else if (externalPercent > 50 && externalPercent <= 90) {
            good++;
            externalClass = 1;
            this.problematicData.push('Problem with External ');
        }
        else {
            bad++;
            externalClass = 2;
            this.problematicData.push('Problem with External ');
        }
        if (siteMapXML.length > 0) {
            perfect++;
            siteMapClass = 0;
        }
        else {
            good++;
            siteMapClass = 1;
            this.problematicData.push('Problem with site Map');
        }
        if (canonicalURL) {
            perfect++;
            canonicalClass = 0;
        }
        else {
            good++;
            canonicalClass = 1;
            this.problematicData.push('Problem with canonical URL');
        }
        if (alternative.length > 0) {
            perfect++;
            alternativeClass = 0;
        }
        else {
            good++;
            alternativeClass = 1;
            this.problematicData.push('Problem with Alternative text ');
        }
        if (correctLinks.count > 30 && correctLinks.count < 110) {
            perfect++;
            correctLinkClass = 0;
        }
        else if (correctLinks.count <= 0) {
            bad++;
            correctLinkClass = 2;
            this.problematicData.push('Problem with correctLinks');
        }
        else {
            good++;
            correctLinkClass = 1;
            this.problematicData.push('Problem with correctLinks');
        }
        if (external > internal) {
            bad++;
            this.problematicData.push('External > Internal ');
        }
        else {
            perfect++;
        }
        this.warning += good;
        this.critical += bad;
        this.valid += perfect;
        this.validSeo = utils_1.Utils.percent(perfect, 12);
        return {
            allLinks: followData.allLinks,
            allLinksCount: followData.allLinks.length,
            title: title,
            titleClass: titleClass,
            titleCount: titleCount,
            metaDescription: metaDescription,
            metaDescriptionClass: metaDescriptionClass,
            descriptionCount: descriptionCount,
            metaRobotClass: metaRobotClass,
            metaRobotTextClass: metaRobotTextClass,
            isMetaRobotExist: isMetaRobotExist,
            metaDataClass: metaDataClass,
            robotsText: robotsText,
            robotsTextLength: robotsText.length,
            siteMapClass: siteMapClass,
            siteMapXML: siteMapXML,
            canonicalClass: canonicalClass,
            canonicalURL: canonicalURL,
            correctLinkClass: correctLinkClass,
            alternativeClass: alternativeClass,
            alternative: alternative,
            alternativeTextCount: alternativeCount,
            followData: followData,
            metaData: metaData,
            correctLinks: correctLinks,
            externalClass: externalClass,
            external: external,
            linkJuiceClass: linkJuiceClass
        };
    };
    PageAnalysisComponent.prototype.contentScoreCount = function (data) {
        var allDom = data.allDom;
        var good = 0;
        var bad = 0;
        var perfect = 0;
        var percentsInTextClass = 0;
        var countInfoClass = 0;
        var titleCohanceClass = 0;
        var keywordDensityClass = 0;
        var microdataArrayClass = 0;
        var counts = this.getCountOf_H(allDom);
        var countInfo = {
            h1Count: counts.h1,
            h2Count: counts.h2,
            h3Count: counts.h3,
            h4Count: counts.h4,
            h5Count: counts.h5,
            h6Count: counts.h6
        };
        var microdataArray = this.checkMicrodata(allDom);
        this.stripScripts(allDom);
        this.stripStyle(allDom);
        var resultOfBody = this.getTags(allDom);
        var result = resultOfBody.replace(/(?:\r\n|\n|\r)/g, ' ').replace(/^\s+|\s+$|\s+(?=\s)|\+/g, ' ').replace(/\,/g, ' ').replace(/[0-9]/g, ' ');
        // let removeNumbers = resultOfBody.replace(/[0-9]/g, ' ');
        // let removeSymbols = removeNumbers.replace(/[&\/\\#,+()$~%.'":!@*?<>{}]/g,'');
        var keywordArray = result.split(" ");
        var keywords1 = [];
        for (var i = 0; i < keywordArray.length; i++) {
            if (keywordArray[i].length > 3) {
                keywords1.push(keywordArray[i]);
            }
        }
        var keywords2 = this.chunkArray(keywords1, 2);
        var keywords3 = this.chunkArray(keywords1, 3);
        //let keywordArray3 = removeSymbols.split(" ", 3);
        var tmp = document.createElement("div");
        tmp.innerHTML = allDom.body.innerText;
        var s = tmp.innerText.trim();
        s = s.replace(/(?:\r\n|\n|\r)/g, '').replace(/^\s+|\s+$|\s+(?=\s)|\+/g, '').replace(/\,/g, "").replace(/[0-9]/g, '');
        var allTExt = s.split(" ");
        var tagsArray = this.getTagWithValue(allDom, s);
        var eee = this.keywordsInTags(tagsArray, s.split(" "));
        var percentsInText = this.textInPercent(s.length, this.siteData.result.length);
        //let keywordsOfTwoWords = this.keywordCount(s, this.chunkArray(s.split(" "), 2));
        var keywords1Count = this.countKey(keywords1);
        var keywords2Count = this.countKey(keywords2);
        var keywords3Count = this.countKey(keywords3);
        var cloudData = [];
        var keywordCountArray1 = [];
        for (var key1 in keywords1Count) {
            var repetitionOfKeyword = ((keywords1Count[key1] / tagsArray.length) * 100).toPrecision(3);
            if (cloudData.length <= 50) {
                var currentData = [];
                currentData.push(key1, keywords1Count[key1] * 10);
                cloudData.push(currentData);
            }
            keywordCountArray1.push({
                name: key1,
                value: keywords1Count[key1],
                density: repetitionOfKeyword
            });
        }
        var keywordCountArray2 = [];
        for (var key2 in keywords2Count) {
            var repetitionOfKeyword = ((keywords2Count[key2] / tagsArray.length) * 100).toPrecision(3);
            keywordCountArray2.push({
                name: key2,
                value: keywords2Count[key2],
                density: repetitionOfKeyword
            });
        }
        var keywordCountArray3 = [];
        for (var key3 in keywords3Count) {
            var repetitionOfKeyword = ((keywords3Count[key3] / tagsArray.length) * 100).toPrecision(3);
            keywordCountArray3.push({
                name: key3,
                value: keywords3Count[key3],
                density: repetitionOfKeyword
            });
        }
        var mainKeywords = [];
        var quantityKeyword = 0;
        var keywordRepetition = 0;
        var keywordsCounts = 0;
        var checkTitle = [];
        var titleCohance = [];
        checkTitle = this.checkTitle_(allDom);
        titleCohance = this.compareArrays(checkTitle, mainKeywords);
        if (percentsInText >= 15) {
            perfect++;
            percentsInTextClass = 0;
        }
        if (percentsInText < 15 && percentsInText > 0) {
            good++;
            percentsInTextClass = 1;
            this.problematicData.push('Problem with percent in text');
        }
        else {
            bad++;
            percentsInTextClass = 2;
            this.problematicData.push('Problem with percent in text');
        }
        if (countInfo.h1Count > 0 && countInfo.h2Count > 0 && countInfo.h3Count && countInfo.h4Count > 0 && countInfo.h5Count > 0 && countInfo.h6Count) {
            perfect++;
            countInfoClass = 0;
        }
        if (countInfo.h1Count > 0) {
            good++;
            countInfoClass = 1;
            this.problematicData.push('Problem with some h tags');
        }
        else {
            bad++;
            countInfoClass = 2;
            this.problematicData.push('Problem with some h tags');
        }
        if (titleCohance.length > 0) {
            perfect++;
            titleCohanceClass = 0;
        }
        else {
            bad++;
            titleCohanceClass = 2;
            this.problematicData.push('Problem with title Cohance');
        }
        if (microdataArray) {
            perfect++;
            microdataArrayClass = 0;
        }
        else {
            this.problematicData.push('Problem with Microdata');
            good++;
            microdataArrayClass = 1;
        }
        this.warning += good;
        this.critical += bad;
        this.valid += perfect;
        this.validContent = utils_1.Utils.percent(perfect, 5);
        return {
            percentsInText: percentsInText,
            percentsInTextClass: percentsInTextClass,
            countInfo: countInfo,
            countInfoClass: countInfoClass,
            titleCohance: titleCohance,
            titleCohanceClass: titleCohanceClass,
            keywordCountArray1: keywordCountArray1,
            keywordCountArray2: keywordCountArray2,
            keywordCountArray3: keywordCountArray3,
            quantityKeyword: quantityKeyword,
            microdataArrayClass: microdataArrayClass,
            microdataArray: microdataArray,
            checkTitle: checkTitle,
            cloudData: cloudData
        };
    };
    PageAnalysisComponent.prototype.designScoreCount = function (data) {
        var allDom = data.allDom;
        var good = 0;
        var bad = 0;
        var perfect = 0;
        var protectClass = 0;
        var swfClass = 0;
        var frameClass = 0;
        var contetntSecureClass = 0;
        var commentClass = 0;
        var doctypeClass = 0;
        var charsetClass = 0;
        var tableClass = 0;
        var contentSecurityPolicy = data.contentSecurityPolicy ? data.contentSecurityPolicy : null;
        var xssProtection = data.xssProtection ? data.xssProtection : null;
        var tables = this.checkTables(allDom);
        var comments = this.findComments(allDom);
        var commentLength = comments.length ? comments.length : 0;
        var getFrames = this.getFrame(allDom);
        var headerInfo = this.getHeadInfo(allDom);
        var swfs = this.findSWF(allDom);
        if (contentSecurityPolicy != null) {
            bad++;
            contetntSecureClass = 2;
            this.problematicData.push('Problem with content Security Policy');
        }
        else {
            perfect++;
            contetntSecureClass = 0;
        }
        if (xssProtection) {
            perfect++;
            protectClass = 0;
        }
        else {
            bad++;
            protectClass = 2;
            this.problematicData.push('Problem with xss protection');
        }
        if (swfs.length > 0) {
            bad++;
            swfClass = 2;
            this.problematicData.push('Problem with swfs');
        }
        else {
            perfect++;
            swfClass = 0;
        }
        if (getFrames.length > 0) {
            bad++;
            frameClass = 2;
            this.problematicData.push('Problem with frames');
        }
        else {
            perfect++;
            frameClass = 0;
        }
        if (commentLength > 0) {
            good++;
            commentClass = 1;
            this.problematicData.push('Problem with comment data');
        }
        else {
            perfect++;
            commentClass = 0;
        }
        if (headerInfo.result == 1) {
            good++;
            doctypeClass = 1;
            this.problematicData.push('Problem with header info');
        }
        else if (headerInfo.result == 0) {
            perfect++;
            doctypeClass = 0;
        }
        else {
            bad++;
            doctypeClass = 2;
            this.problematicData.push('Problem with header info');
        }
        if (data.content) {
            perfect++;
            charsetClass = 0;
        }
        else {
            good++;
            charsetClass = 1;
            this.problematicData.push('Problem with charset data');
        }
        if (tables > 0) {
            bad++;
            tableClass = 2;
            this.problematicData.push('Problem with tables');
        }
        else {
            perfect++;
            tableClass = 0;
        }
        this.warning += good;
        this.critical += bad;
        this.valid += perfect;
        this.validDesign = utils_1.Utils.percent(perfect, 8);
        return {
            protectClass: protectClass,
            swfClass: swfClass,
            frameClass: frameClass,
            contetntSecureClass: contetntSecureClass,
            commentClass: commentClass,
            doctypeClass: doctypeClass,
            charsetClass: charsetClass,
            tableClass: tableClass,
            headerInfo: headerInfo,
            tables: tables,
            getFrames: getFrames,
            swfs: swfs,
            comments: comments
        };
    };
    PageAnalysisComponent.prototype.performanceScoreCount = function (data) {
        var allDom = data.allDom;
        var caching = data.caching;
        var good = 0;
        var bad = 0;
        var perfect = 0;
        var locatedCriptsClass = 0;
        var contentLengthClass = 0;
        var stylesClass = 0;
        var scriptClass = 0;
        var cachingClass = 0;
        var inlineClass = 0;
        var getInlineStyles = this._getInlineStyles(allDom).length > 0 ? this._getInlineStyles(allDom) : "";
        var getStyles = this.getStylesTag();
        var locatedScripts = this._locatedScripts(allDom);
        var realStylePercent = this.countMb(getStyles);
        var realScriptsPercent = this.getIntegratedScript(allDom);
        var contentLength = data.contentLength > 0 ? (data.contentLength / 1024).toPrecision(3) : 0;
        var timeClass = 0;
        var time = data.time;
        if (time <= 100) {
            perfect++;
            timeClass = 0;
        }
        else {
            good++;
            timeClass = 1;
            this.problematicData.push('Problem with Time');
        }
        if (contentLength > 50) {
            good++;
            contentLengthClass = 1;
            this.problematicData.push('Problem with content Length');
        }
        else {
            perfect++;
            contentLengthClass = 0;
        }
        if (locatedScripts != null && locatedScripts.length > 0) {
            good++;
            locatedCriptsClass = 1;
            this.problematicData.push('Problem with located Scripts');
        }
        else {
            perfect++;
            locatedCriptsClass = 0;
        }
        if (realStylePercent > 0) {
            good++;
            stylesClass = 1;
            this.problematicData.push('Problem with style  percent');
        }
        else {
            perfect++;
            stylesClass = 0;
        }
        if (realScriptsPercent > 0) {
            good++;
            scriptClass = 1;
            this.problematicData.push('Problem with real script  percent');
        }
        else {
            perfect++;
            scriptClass = 0;
        }
        if (caching) {
            perfect++;
            cachingClass = 0;
        }
        else {
            good++;
            cachingClass = 1;
            this.problematicData.push('Problem with caching');
        }
        if (getInlineStyles) {
            good++;
            inlineClass = 1;
            this.problematicData.push('Problem with inlne style');
        }
        else {
            perfect++;
            inlineClass = 0;
        }
        this.warning += good;
        this.critical += bad;
        this.valid += perfect;
        this.validPerformance = utils_1.Utils.percent(perfect, 8);
        return {
            caching: caching,
            inlineClass: inlineClass,
            inlineStyles: getInlineStyles,
            cachingClass: cachingClass,
            scriptClass: scriptClass,
            locatedCriptsClass: locatedCriptsClass,
            stylesClass: stylesClass,
            realScriptsPercent: realScriptsPercent,
            realStylePercent: realStylePercent,
            locatedScripts: locatedScripts,
            contentLengthClass: contentLengthClass,
            contentLength: contentLength,
            time: time,
            timeClass: timeClass
        };
    };
    PageAnalysisComponent.prototype.accessibilityScore = function (data) {
        var allDom = this.createDOM(data.result);
        // let dom = this.siteData.allDom;
        var mainUrl = data.mainUrl;
        var fullUrl = data.fullUrl;
        var domain = data.domain;
        var good = 0;
        var bad = 0;
        var perfect = 0;
        var el = document.createElement('a');
        el.href = fullUrl;
        var cleanUrl = el.pathname;
        var checkUrlForClean = cleanUrl.indexOf(".") != -1 ? false : true;
        var getNoScript = this.getNoScript(allDom);
        var script_ = this.getScript(allDom);
        var getBgSound = this.getBgSound(allDom);
        var favicon = this.getFavicon(allDom);
        var getHTMLLang = this.getHTMLLng(allDom);
        var openGraph = this.getGraphOBJ(allDom);
        var getTwitterCard = this.getTwitterCard(allDom);
        var getPublisher = this.getPublisher(allDom);
        var viewPort = this.viewPort(allDom);
        if (viewPort) {
            perfect++;
        }
        else {
            good++;
            this.problematicData.push('problem with responsive');
        }
        if (getPublisher) {
            perfect++;
        }
        else {
            good++;
            this.problematicData.push('Problem With Publishers');
        }
        if (getTwitterCard['twitter:card']) {
            perfect++;
        }
        else {
            good++;
            this.problematicData.push('Problem with Twitter Obect');
        }
        if (openGraph['og:title'] && openGraph['og:description'] && openGraph['og:url']) {
            perfect++;
        }
        else {
            this.problematicData.push("Problem with ");
            good++;
        }
        if (getHTMLLang) {
            perfect++;
        }
        else {
            good++;
            this.problematicData.push('Problem with content Lang');
        }
        if (favicon) {
            perfect++;
        }
        else {
            good++;
            this.problematicData.push("Problem with favicon");
        }
        if (getBgSound) {
            good++;
            this.problematicData.push('Problem BGSOund');
        }
        else {
            perfect;
        }
        if (script_) {
            if (getNoScript) {
                perfect++;
            }
            else {
                good++;
                this.problematicData.push("Problem With No Script");
            }
        }
        if (!checkUrlForClean) {
            good++;
            this.problematicData.push("Problem With URL Ceaning");
        }
        else {
            perfect++;
        }
        if (domain.length >= 15) {
            good++;
            this.problematicData.push("Problem with DomainLength");
        }
        else {
            perfect++;
        }
        this.warning += good;
        this.critical += bad;
        this.valid += perfect;
        this.validAccessibility = utils_1.Utils.percent(perfect, 10);
        return {
            checkUrlForClean: checkUrlForClean,
            domain: domain,
            getNoScript: getNoScript,
            script_: script_,
            getBgSound: getBgSound,
            favicon: favicon,
            getHTMLLang: getHTMLLang,
            openGraph: openGraph,
            getTwitterCard: getTwitterCard,
            getPublisher: getPublisher,
            viewPort: viewPort
        };
    };
    PageAnalysisComponent.prototype.stringToEl = function (string) {
        var parser = new DOMParser(), content = 'text/html', DOM = parser.parseFromString(string, content);
        return DOM.body.childNodes[0];
    };
    PageAnalysisComponent.prototype.createDOM = function (dom) {
        return this.stringToEl(dom).ownerDocument;
    };
    PageAnalysisComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    // Performance Tab
    PageAnalysisComponent.prototype._locatedScripts = function (el) {
        var scripts = el.getElementsByTagName('script');
        var array = [];
        for (var i = 0; i < scripts.length; i++) {
            var attr = scripts[i].getAttribute('src');
            if (attr != null && attr != "") {
                array.push(attr);
            }
        }
        return array;
    };
    PageAnalysisComponent.prototype.countMb = function (num) {
        var a = num / 1024;
        var b = a / 1024;
        return (num / 1000000);
    };
    PageAnalysisComponent.prototype.getStylesTag = function () {
        var getTags = document.getElementsByTagName('style') ? document.getElementsByTagName('style').length : 0;
        return getTags;
    };
    PageAnalysisComponent.prototype.getIntegratedScript = function (el) {
        var scripts = el.getElementsByTagName('script');
        var count = 0;
        for (var i = 0; i < scripts.length; i++) {
            count += sizeof(scripts[i].innerText);
        }
        return count;
    };
    PageAnalysisComponent.prototype._getInlineStyles = function (el) {
        var getTags = document.getElementsByTagName('*');
        var styleArray = [];
        for (var i = 0; i < getTags.length; i++) {
            var attr = getTags[i].getAttribute('style');
            if (attr != null) {
                styleArray.push(attr);
            }
        }
        return styleArray;
    };
    //end Performance Tab
    //Design Tab
    PageAnalysisComponent.prototype.findEmail = function (dom) {
        var email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        return dom.match(email);
    };
    //TODO create function for getting tags
    PageAnalysisComponent.prototype.findSWF = function (el) {
        var tags = el.getElementsByTagName("*");
        var reg = /[a-zA-Z0-9\.:/]+?\.swf/g;
        var swfArray = [];
        for (var i = 0; i < tags.length; i++) {
            var getAttr = tags[i].getAttribute('src');
            if (getAttr && getAttr.match(reg))
                swfArray.push(getAttr);
        }
        return swfArray;
    };
    PageAnalysisComponent.prototype.getFrame = function (el) {
        var frames = Object;
        var frame = document.getElementsByTagName('frame') ? document.getElementsByTagName('frame').length : null;
        var iframe = document.getElementsByTagName('iframe') ? document.getElementsByTagName('frame').length : null;
        var frameset = document.getElementsByTagName('frameset') ? document.getElementsByTagName('frame').length : null;
        return {
            frame: frame,
            iframe: iframe,
            frameset: frameset,
            length: frame + iframe + frameset
        };
    };
    PageAnalysisComponent.prototype.generateComments = function (el) {
        var arr = [];
        for (var i = 0; i < el.childNodes.length; i++) {
            var node = el.childNodes[i];
            if (node.nodeType === 8) {
                arr.push(node);
            }
            else {
                arr.push.apply(arr, this.generateComments(node));
            }
        }
        return arr;
    };
    PageAnalysisComponent.prototype.findComments = function (el) {
        return this.generateComments(el);
    };
    ;
    PageAnalysisComponent.prototype.getHeadInfo = function (el) {
        var node = el.doctype;
        var str = '';
        var result = 2;
        var html = "<!DOCTYPE "
            + node.name
            + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
            + (!node.publicId && node.systemId ? ' SYSTEM' : '')
            + (node.systemId ? ' "' + node.systemId + '"' : '')
            + '>';
        var strStrong_4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">';
        var strStrongPassing_4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
        var allFrame_4 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">';
        var html_5 = "<!DOCTYPE html>";
        var XHTMLStrong_1_0 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
        var XHTMLStrongPass_1_0 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
        var XHTMLStrongPassFrames_1_0 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">';
        var XHTML_1_1 = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">';
        if (html == strStrong_4 || html == strStrongPassing_4 || html == allFrame_4) {
            str = 'HTML 4.01';
            result = 1;
        }
        else if (html == html_5) {
            str = 'HTML 5';
            result = 0;
        }
        else if (html == XHTMLStrong_1_0 || html == XHTMLStrongPass_1_0 || html == XHTMLStrongPassFrames_1_0) {
            str = 'XHTML 1.0';
            result = 1;
        }
        else if (html == XHTML_1_1) {
            str = 'XHTML 1.1';
            result = 1;
        }
        else {
            str = 'HTML 3.x or less ';
            result = 2;
        }
        return {
            html: html,
            str: str,
            result: result
        };
    };
    PageAnalysisComponent.prototype.checkTables = function (el) {
        var tabels = el.getElementsByName('table').length > 0 ? "Page use " + el.getElementsByName('table').length + "tables" : 0;
        return tabels;
    };
    //End Design Tab
    //Seo Tab
    PageAnalysisComponent.prototype.getTitle = function (el) {
        var title = '';
        title += el.getElementsByTagName("title").length > 0 ? el.getElementsByTagName("title")[0].innerHTML : "";
        return title;
    };
    PageAnalysisComponent.prototype.getAllMeta = function (el) {
        var meta = el.getElementsByTagName('meta');
        var metas = [];
        for (var i = 0; i < meta.length; i++) {
            var element = {
                type_: meta[i].attributes[0],
                meta_: meta[i].attributes[0].textContent,
                content: meta[i].attributes[1] ? meta[i].attributes[1].textContent : ''
            };
            metas.push(element);
        }
        return metas;
    };
    PageAnalysisComponent.prototype.isExist = function (str, tag) {
        var a;
        _.each(tag, function (tag_) {
            if (tag_.content == str) {
                a = tag_.meta_;
            }
        });
        return a;
    };
    PageAnalysisComponent.prototype.getCanonical = function (el) {
        var links = el.getElementsByTagName('link');
        var canonical;
        for (var i = 0; i < links.length; i++) {
            var rel = links[i].getAttribute('rel');
            if (rel == 'canonical') {
                canonical = links[i].href;
            }
        }
        return canonical;
    };
    PageAnalysisComponent.prototype.getImages = function (dom) {
        var img = dom.getElementsByTagName('img');
        var alternatives = [];
        for (var i = 0; i < img.length; i++) {
            alternatives.push({
                image: img[i].getAttribute('src'),
                alt: img[i].getAttribute('alt')
            });
        }
        return alternatives;
    };
    PageAnalysisComponent.prototype.checkProperLinksCount = function (el) {
        var links = this.getAllLinks(el);
        var correctURL = [];
        var allLinks = [];
        var followCount = 0;
        var noFollowCount = 0;
        var rel = null;
        var count = 0;
        var urlpattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
        for (var i = 0; i < links.length; i++) {
            allLinks.push(links[i].getAttribute('href'));
            rel = links[i].getAttribute('rel');
            if (rel) {
                if (rel == "nofollow") {
                    noFollowCount++;
                }
                else {
                    followCount++;
                }
            }
            else {
                followCount++;
            }
            if (urlpattern.test(links[i])) {
                count++;
                correctURL.push(links[i]);
            }
        }
        return {
            data: correctURL,
            count: count,
            allLinks: allLinks,
            followCount: followCount,
            noFollowCount: noFollowCount
        };
    };
    PageAnalysisComponent.prototype.getAllLinks = function (el) {
        var links = el.getElementsByTagName('a');
        return links;
    };
    PageAnalysisComponent.prototype.getExternalLinks = function (el, str) {
        // str = str;
        var links = this.checkProperLinksCount(el);
        var link = '';
        var externalCount = 0;
        var internaLinksCount = 0;
        var linksData = links.data;
        for (var i = 0; i < linksData.length; i++) {
            link = (linksData[i].host).replace(/^www\./, '');
            if (link) {
                if (link !== str) {
                    externalCount++;
                }
                /* else {
                 internaLinksCount++;
                 }*/
            }
        }
        return {
            count: links.data.length,
            follow: links.followCount,
            noFollow: links.noFollowCount,
            external: externalCount,
            allLinks: links.allLinks
        };
    };
    PageAnalysisComponent.prototype.check = function (url) {
        var _this = this;
        var mainUrl = "";
        this.url = url;
        var valid = this.checkURL(this.url);
        var data = {};
        var domain = "";
        if (valid) {
            this.indexService.check(this.url).subscribe(function (result) {
                data = result;
                mainUrl = result.mainUrl;
                domain = result.domain;
                var path = "https://www.google.com/search?q=" + encodeURIComponent(mainUrl);
                _this.indexService.getAllData(_this.url, mainUrl, path).subscribe(function (allResult) {
                    data.siteMapResult = allResult[0];
                    data.googleResult = allResult[1];
                    data.robotResult = allResult[2];
                    _this.indexService.saveData(data, domain).subscribe(function (res) {
                        _this.router.navigate(['/page-analysis']);
                    });
                });
            });
        }
        else {
            this.errorMsg.showErrorMessage("Oops !!! An error occured.Please enter a valid url.");
        }
    };
    PageAnalysisComponent.prototype.checkURL = function (url) {
        var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        return valid;
    };
    //End Seo Tab
    /* Start Content tab*/
    PageAnalysisComponent.prototype.textInPercent = function (strLength, domLength) {
        return (strLength * 100 / domLength).toPrecision(3);
    };
    //Get tags
    PageAnalysisComponent.prototype.getTags = function (dom) {
        var coinsArray = [];
        var getTitleTag = dom.getElementsByTagName('title');
        var getHrefTags = dom.getElementsByTagName('a');
        var getH1 = dom.getElementsByTagName('h1');
        var getH2 = dom.getElementsByTagName('h2');
        var getH3 = dom.getElementsByTagName('h3');
        var getH4 = dom.getElementsByTagName('h4');
        var getH5 = dom.getElementsByTagName('h5');
        var getH6 = dom.getElementsByTagName('h6');
        var getMeta = dom.getElementsByTagName('meta');
        var getImg = dom.getElementsByTagName('img');
        // getH2.prototype.slice.call( 'htmlCollection' );
        // let getH = getH1.concat(getH2,getH3,getH4,getH5,getH6);
        //TODO with function
        if (getTitleTag && getTitleTag.length > 0) {
            coinsArray.push(getTitleTag[0].textContent);
        }
        if (getHrefTags && getHrefTags.length > 0) {
            for (var i = 0; i < getHrefTags.length; i++) {
                var getHrefTag = getHrefTags[i].innerText.split("\n");
                for (var j = 0; j < getHrefTag.length; j++) {
                    if (getHrefTag[j].trim() != "") {
                        coinsArray.push(getHrefTag[j].trim());
                    }
                }
            }
        }
        if (getH1.length > 0) {
            for (var i = 0; i < getH1.length; i++) {
                var h1 = getH1[i].innerText.split("\n");
                for (var j = 0; j < h1.length; j++) {
                    if (h1[j].trim() != "")
                        coinsArray.push(h1[j].trim());
                }
            }
        }
        if (getH2.length > 0) {
            for (var i = 0; i < getH2.length; i++) {
                var h2 = getH2[i].innerText.split("\n");
                for (var j = 0; j < h2.length; j++) {
                    if (h2[j].trim() != "")
                        coinsArray.push(h2[j].trim());
                }
            }
        }
        if (getH3.length > 0) {
            for (var i = 0; i < getH3.length; i++) {
                var h3 = getH3[i].innerText.split("\n");
                for (var j = 0; j < h3.length; j++) {
                    if (h3[j].trim() != "")
                        coinsArray.push(h3[j].trim());
                }
            }
        }
        if (getH4.length > 0) {
            for (var i = 0; i < getH4.length; i++) {
                var h4 = getH4[i].innerText.split("\n");
                for (var j = 0; j < h4.length; j++) {
                    if (h4[j].trim() != "")
                        coinsArray.push(h4[j].trim());
                }
            }
        }
        if (getH5.length > 0) {
            for (var i = 0; i < getH5.length; i++) {
                var h5 = getH5[i].innerText.split("\n");
                for (var j = 0; j < h5.length; j++) {
                    if (h5[j].trim() != "")
                        coinsArray.push(h5[j].trim());
                }
            }
        }
        if (getH6.length > 0) {
            for (var i = 0; i < getH6.length; i++) {
                var h6 = getH6[i].innerText.split("\n");
                for (var j = 0; j < h6.length; j++) {
                    if (h6[j].trim() != "")
                        coinsArray.push(h6[j].trim());
                }
            }
        }
        if (getTitleTag.length > 0) {
            coinsArray.push(getTitleTag[0].textContent);
        }
        if (getMeta.length > 0) {
            for (var i = 0; i < getMeta.length; i++) {
                if (getMeta[i].name == 'keywords' || getMeta[i].name == 'description') {
                    if (getMeta[i] && getMeta[i].content != "") {
                        coinsArray.push(getMeta[i].content);
                    }
                }
            }
        }
        if (getImg.length > 0) {
            for (var i = 0; i < getImg.length; i++) {
                var imgAlt = getImg[i].getAttribute('alt');
                if (imgAlt && imgAlt != "") {
                    coinsArray.push(imgAlt.content);
                }
            }
        }
        return coinsArray.join();
    };
    PageAnalysisComponent.prototype.keywordCount = function (str, secondArray) {
        try {
            var mas = {};
            for (var i = 0; i < secondArray.length; i++) {
                var currentArray = secondArray[i];
                if (currentArray != null && currentArray != "") {
                    var reg = str.match(new RegExp(currentArray, 'ig'));
                    if (reg) {
                        var count = reg.length;
                        mas[currentArray] = count;
                    }
                }
            }
        }
        catch (e) {
        }
        return mas;
    };
    PageAnalysisComponent.prototype.getCountOf_H = function (el) {
        var h1 = el.getElementsByTagName('h1');
        var h2 = el.getElementsByTagName('h2');
        var h3 = el.getElementsByTagName('h3');
        var h4 = el.getElementsByTagName('h4');
        var h5 = el.getElementsByTagName('h5');
        var h6 = el.getElementsByTagName('h6');
        return {
            h1: h1.length,
            h2: h2.length,
            h3: h3.length,
            h4: h4.length,
            h5: h5.length,
            h6: h6.length
        };
    };
    PageAnalysisComponent.prototype.checkMicrodata = function (el) {
        var html = el.getElementsByTagName('html');
        var meta = el.getElementsByTagName('*');
        var microdata = [];
        for (var i = 0; i < meta.length; i++) {
            var itemtype = meta[i].getAttribute('itemtype');
            if (meta[i].getAttribute('itemtype')) {
                microdata.push(meta[i].getAttribute('itemtype'));
            }
        }
        return microdata;
    };
    PageAnalysisComponent.prototype.checkTitle_ = function (dom) {
        var title = dom.getElementsByTagName('title').length > 0 ? dom.getElementsByTagName('title')[0].innerText : "";
        return title.split(" ");
    };
    PageAnalysisComponent.prototype.compareArrays = function (arr1, arr2) {
        return _.intersection(arr1, arr2);
    };
    PageAnalysisComponent.prototype.getTagWithValue = function (el, str) {
        var tags = el.getElementsByTagName('*');
        var array = [];
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].tagName.toLowerCase() != "script" && tags[i].tagName.toLowerCase() != "meta") {
                if (tags[i].childNodes.length == 1) {
                    array.push({
                        tag: tags[i].tagName,
                        value: tags[i].childNodes[0],
                        type: tags[i].childNodes
                    });
                }
            }
        }
        return array;
    };
    PageAnalysisComponent.prototype.keywordsInTags = function (tags, keywords) {
        var allArray = [];
        for (var i = 0; i < keywords.length; i++) {
            var keyword = keywords[i];
            if (keyword.length > 2) {
                var repeatsInTags = [];
                for (var j = 0; j < tags.length; j++) {
                    var count = 0;
                    var content = tags[j].value.textContent.split(" ");
                    var tag = tags[j].tag;
                    for (var k = 0; k < content.length; k++) {
                        if (keyword.indexOf(content[k]) >= 0) {
                            repeatsInTags.push(tag);
                        }
                    }
                    //if (count != 0) {
                    //  repeatsInTags.push({
                    //    tag: tag,
                    //    count: count
                    //  });
                    //}
                }
                if (repeatsInTags.length > 0) {
                    allArray.push({
                        keyword: keyword,
                        repeatsInTags: repeatsInTags
                    });
                }
            }
        }
    };
    // Remove all Scripts
    PageAnalysisComponent.prototype.stripScripts = function (s) {
        //var div = document.createElement('div');
        s.innerHTML = s;
        var scripts = s.getElementsByTagName('script').length > 0 ? s.getElementsByTagName('script') : null;
        var noScripts = s.getElementsByTagName('noscript').length > 0 ? s.getElementsByTagName('noscript') : null;
        if (scripts != null || noScripts != null) {
            if (scripts != null) {
                var i = scripts.length;
                while (i--) {
                    scripts[i].parentNode.removeChild(scripts[i]);
                }
            }
            if (noScripts != null) {
                var i = noScripts.length;
                while (i--) {
                    noScripts[i].parentNode.removeChild(noScripts[i]);
                }
            }
            return s.innerHTML;
        }
        else {
            return s;
        }
    };
    //Remove all Styles
    PageAnalysisComponent.prototype.stripStyle = function (s) {
        //var div = document.createElement('div');
        s.innerHTML = s;
        var styles = s.getElementsByTagName('style').length > 0 ? s.getElementsByTagName('style') : null;
        if (styles != null) {
            var i = styles.length;
            while (i--) {
                styles[i].parentNode.removeChild(styles[i]);
            }
            return s.innerHTML;
        }
        else {
            return s;
        }
    };
    PageAnalysisComponent.prototype.chunkArray = function (arr, chunkSize) {
        var groups = [], i;
        for (i = 0; i < arr.length; i += chunkSize) {
            groups.push(arr.slice(i, i + chunkSize).join(" "));
        }
        return groups;
    };
    PageAnalysisComponent.prototype.toCeil = function (follow, links) {
        var a = 0;
        a = (100 * follow) / links;
        return Math.ceil(a);
    };
    PageAnalysisComponent.prototype.toPrecision = function (follow, links) {
        var a = 0;
        a = (100 * follow) / links;
        return a.toPrecision(4);
    };
    /* Meta Description */
    PageAnalysisComponent.prototype.findeContentDescription = function (el) {
        var meta = el.getElementsByTagName('meta');
        var description = '';
        for (var i = 0; i < meta.length; i++) {
            if (meta[i].getAttribute('name') == 'description') {
                description = meta[i].getAttribute('content');
            }
        }
        return description;
    };
    /* Alternative text count */
    PageAnalysisComponent.prototype.countAlternativeText = function (dom) {
        var img = dom.getElementsByTagName('img');
        var count = 0;
        for (var i = 0; i < img.length; i++) {
            if (img[i].getAttribute('alt')) {
                count++;
            }
        }
        return count;
    };
    PageAnalysisComponent.prototype.countKey = function (array_elements) {
        array_elements.sort();
        var keys = {};
        var current = null;
        var cnt = 0;
        for (var i = 0; i < array_elements.length; i++) {
            if (array_elements[i].length > 3) {
                if (array_elements[i] != current) {
                    if (cnt > 0) {
                        keys[current] = cnt;
                    }
                    current = array_elements[i];
                    cnt = 1;
                }
                else {
                    cnt++;
                }
                keys[current] = cnt;
            }
        }
        return keys;
    };
    // Get NoScript
    PageAnalysisComponent.prototype.getNoScript = function (dom) {
        var noScript = dom.getElementsByTagName('noscript').length ? true : false;
        return noScript;
    };
    PageAnalysisComponent.prototype.getScript = function (dom) {
        var script_ = dom.getElementsByTagName('script').length ? true : false;
        return script_;
    };
    PageAnalysisComponent.prototype.getBgSound = function (dom) {
        var bgSound = dom.getElementsByTagName('bgsound ').length ? true : false;
        return bgSound;
    };
    PageAnalysisComponent.prototype.getInputs = function (dom) {
        var allInputs = dom.getElementsByTagName('input');
        return allInputs;
    };
    PageAnalysisComponent.prototype.getFavicon = function (dom) {
        var allLink = dom.getElementsByTagName('link');
        var favicon = false;
        for (var i = 0; i < allLink.length; i++) {
            var rel = allLink[i].getAttribute('rel');
            if (rel) {
                if (rel == 'shortcut icon') {
                    favicon = true;
                    return favicon;
                }
            }
            ;
        }
        return favicon;
    };
    PageAnalysisComponent.prototype.getHTMLLng = function (dom) {
        var getHTMLLng = dom.getElementsByTagName('html');
        var HTMLLang = false;
        for (var i = 0; i < getHTMLLng.length; i++) {
            var lang = getHTMLLng[i].getAttribute('lang');
            if (lang) {
                return lang;
            }
            else
                return HTMLLang;
        }
    };
    PageAnalysisComponent.prototype.getGraphOBJ = function (dom) {
        var getMetas = dom.getElementsByTagName('meta');
        var metaTags = [];
        for (var i = 0; i < getMetas.length; i++) {
            if (getMetas[i].getAttribute('property')) {
                metaTags.push(getMetas[i]);
            }
        }
        var arr = {};
        var og = /og:/gi;
        for (var i = 0; i < metaTags.length; i++) {
            if (metaTags[i].getAttribute('property').match(og)) {
                arr[metaTags[i].getAttribute('property')] = metaTags[i].getAttribute('content');
            }
        }
        return arr;
    };
    PageAnalysisComponent.prototype.getTwitterCard = function (dom) {
        var getMetas = dom.getElementsByTagName('meta');
        var metaTags = [];
        for (var i = 0; i < getMetas.length; i++) {
            if (getMetas[i].getAttribute('name')) {
                metaTags.push(getMetas[i]);
            }
        }
        var arr = {};
        var twitter = /twitter:/gi;
        for (var i = 0; i < metaTags.length; i++) {
            if (metaTags[i].getAttribute('name').match(twitter)) {
                arr[metaTags[i].getAttribute('name')] = metaTags[i].getAttribute('content');
            }
        }
        return arr;
    };
    PageAnalysisComponent.prototype.getPublisher = function (dom) {
        var getLink = dom.getElementsByTagName('link');
        // let publishers = [];
        for (var i = 0; i < getLink.length; i++) {
            if (getLink[i].getAttribute('rel') && getLink[i].getAttribute('rel') == 'publisher') {
                return getLink[i].getAttribute('href');
            }
        }
    };
    PageAnalysisComponent.prototype.viewPort = function (dom) {
        var isViewReport = false;
        var getMetas = dom.getElementsByTagName('meta');
        for (var i = 0; i < getMetas.length; i++) {
            if (getMetas[i].getAttribute('name') && getMetas[i].getAttribute('name') == 'viewport') {
                isViewReport = true;
                return isViewReport;
            }
        }
        return isViewReport;
    };
    return PageAnalysisComponent;
}());
__decorate([
    core_1.ViewChild(error_message_component_1.ErrorMessageComponent)
], PageAnalysisComponent.prototype, "errorMsg", void 0);
PageAnalysisComponent = __decorate([
    core_1.Component({
        selector: 'app-page-analysis',
        templateUrl: 'page-analysis.component.html',
        styleUrls: ['page-analysis.component.css', 'page-analysis.component.scss'],
        encapsulation: core_1.ViewEncapsulation.None
    })
], PageAnalysisComponent);
exports.PageAnalysisComponent = PageAnalysisComponent;
