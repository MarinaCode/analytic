"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var error_message_component_1 = require("../error-message/error-message.component");
var utils_1 = require("../utils/utils");
var s = require("underscore.string");
var CheckerComponent = (function () {
    function CheckerComponent(indexService, router) {
        this.indexService = indexService;
        this.router = router;
        this.plagiatData = [];
        this.allTexts = [];
        this.plagiatAllPercent = 0;
    }
    CheckerComponent.prototype.ngOnInit = function () {
        this.plagiatData = [];
        this.allTexts = [];
    };
    CheckerComponent.prototype.calculatePlagiatPercent = function (text, originalText) {
        var count = 0;
        var plagiatText = [];
        for (var i = 0; i < text.length; i++) {
            if (originalText.indexOf(text[i]) >= 0) {
                plagiatText.push(text[i]);
                this.allTexts.push(text[i]);
                count++;
            }
        }
        return {
            percent: parseFloat(utils_1.Utils.percent(count, originalText.length)),
            plagiatText: plagiatText,
            count: count
        };
    };
    CheckerComponent.prototype.extractDomain = function (url) {
        var domain;
        var protocol;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            protocol = url.split('/')[0];
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }
        //find & remove port number
        domain = domain.split(':')[0];
        return domain;
    };
    CheckerComponent.prototype.edit = function () {
        this.checkBtn._elementRef.nativeElement.setAttribute("style", "display:display"); //this is specific for this button
        this.textArea.nativeElement.style.display = 'flex';
        this.editText.nativeElement.style.display = 'none';
        this.checkingBlock.nativeElement.style.display = 'none';
    };
    CheckerComponent.prototype.add = function () {
        this.edit();
        this.textArea.nativeElement.value = "";
    };
    CheckerComponent.prototype.check = function (value) {
        var _this = this;
        this.plagiatData = [];
        this.allTexts = [];
        var currentPlagiatData = [];
        this.plagiatAllPercent = "";
        var str = "" + value;
        var allCount = 0;
        if (str.length <= 10000 && str.length > 10) {
            this.analyzing.nativeElement.setAttribute("style", "display:flex");
            this.searching.nativeElement.setAttribute("style", "display:flex");
            this.determine.nativeElement.setAttribute("style", "display:flex");
            this.textArea.nativeElement.style.border = "";
            this.localText.nativeElement.style.color = "";
            var strText = value.split(" ");
            var str_ = str.replace(/[^a-zA-Z ]/g, "");
            var res = s.words(str_);
            allCount = res.length;
            var uniqueRes = res.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            });
            var groupedArr = this.chunkArray(uniqueRes, 32);
            var reg = /url\?q=(.+)/g;
            this.analyzing.nativeElement.childNodes[1].classList.add('complete');
            var resUnique = res.filter(function (elem, index) {
                return index == res.indexOf(elem);
            });
            this.indexService.fingGoogle(groupedArr).subscribe(function (data) {
                _this.searching.nativeElement.childNodes[1].classList.add('complete');
                var urls = [];
                var spanStArray = [];
                for (var i = 0; i < data.length; i++) {
                    var currentData = data[i];
                    var rcDiv = currentData.getElementsByClassName('g');
                    for (var k = 0; k < rcDiv.length; k++) {
                        var tag = rcDiv[k].getElementsByClassName('r').length > 0 ? rcDiv[k].getElementsByClassName('r')[0].getElementsByTagName('a')[0] : null;
                        var spanSt = rcDiv[k].getElementsByClassName('st');
                        var attr = tag.getAttribute('href');
                        attr = attr.replace('/url\?q=', "");
                        if (spanSt[0] != null) {
                            var text = s.words(spanSt[0].textContent);
                            var uniqueText = text.filter(function (elem, index) {
                                return index == text.indexOf(elem);
                            });
                            var calculatePlagiat = _this.calculatePlagiatPercent(uniqueText, groupedArr[i]);
                            var calculatePlagiatPercent = calculatePlagiat.percent;
                            if (calculatePlagiatPercent > 0) {
                                var percentText = "";
                                if (calculatePlagiatPercent >= 85) {
                                    percentText = " > 90";
                                    _this.plagiatAllPercent = " < " + 10;
                                }
                                else if (calculatePlagiatPercent <= 0) {
                                    percentText = " < 10";
                                    _this.plagiatAllPercent = " > " + 90;
                                }
                                else {
                                    percentText = calculatePlagiatPercent.toString();
                                }
                            }
                            currentPlagiatData.push({
                                href: attr.split('&')[0],
                                percentPlagiat: percentText,
                                calculatePlagiatPercent: calculatePlagiatPercent,
                                plagiatText: calculatePlagiat.plagiatText,
                                count: calculatePlagiat.count
                            });
                        }
                    }
                }
                if (_this.plagiatAllPercent != " < 10" && _this.plagiatAllPercent != " > 90") {
                    var uniqueTexts = _this.allTexts.filter(function (elem, index) {
                        return index == _this.allTexts.indexOf(elem);
                    });
                    _this.plagiatAllPercent = 100 - Math.ceil(uniqueTexts.length * 100 / res.length);
                }
                currentPlagiatData.sort(function (a, b) {
                    if (a.calculatePlagiatPercent > b.calculatePlagiatPercent) {
                        return -1;
                    }
                    if (a.calculatePlagiatPercent < b.calculatePlagiatPercent) {
                        return 1;
                    }
                });
                _this.plagiatData = currentPlagiatData.splice(0, 10);
                for (var i = 0; i < strText.length; i++) {
                    for (var j = 0; j < _this.plagiatData.length; j++) {
                        var plagiatText = _this.plagiatData[j].plagiatText;
                        for (var k = 0; k < plagiatText.length; k++) {
                            if (strText[i] == plagiatText[k]) {
                                strText[i] = '<span style="color: #e23737;">' + strText[i] + '</span>';
                                break;
                            }
                        }
                    }
                }
                setTimeout(function () {
                    _this.determine.nativeElement.childNodes[1].classList.add('complete');
                    _this.textArea.nativeElement.style.display = 'none';
                    _this.editText.nativeElement.style.display = 'flex';
                    _this.editText.nativeElement.innerHTML = strText.join("&nbsp;");
                    _this.checkBtn._elementRef.nativeElement.setAttribute("style", "display:none");
                    setTimeout(function () {
                        var percentValue = _this.plagiatAllPercent.replace(/>/g, '').replace(/</g, '').replace(/=/g, '').trim();
                        _this.analyzing.nativeElement.childNodes[1].classList.remove('complete');
                        _this.searching.nativeElement.childNodes[1].classList.remove('complete');
                        _this.determine.nativeElement.childNodes[1].classList.remove('complete');
                        _this.analyzing.nativeElement.setAttribute("style", "display:none");
                        _this.searching.nativeElement.setAttribute("style", "display:none");
                        _this.determine.nativeElement.setAttribute("style", "display:none");
                        console.log(_this.plagiatAllPercent + "dkgjlsdg sidf dpog idog dg[;odip");
                        _this.fillPercent.nativeElement.setAttribute("style", "width:" + percentValue + "%");
                    }, 1000);
                    _this.checkingBlock.nativeElement.style.display = 'block';
                }, 2000);
            }, function (err) {
                _this.errorMsg.showErrorMessage("Oops !!! An error occured.");
                _this.analyzing.nativeElement.childNodes[1].classList.remove('complete');
                _this.searching.nativeElement.childNodes[1].classList.remove('complete');
                _this.determine.nativeElement.childNodes[1].classList.remove('complete');
                _this.analyzing.nativeElement.setAttribute("style", "display:none");
                _this.searching.nativeElement.setAttribute("style", "display:none");
                _this.determine.nativeElement.setAttribute("style", "display:none");
            });
        }
        else {
            this.textArea.nativeElement.style.border = "1px  solid #e23737";
            this.localText.nativeElement.style.color = "#e23737";
        }
    };
    CheckerComponent.prototype.stripScripts = function (s) {
        var scripts = s.getElementsByTagName('script').length > 0 ? s.getElementsByTagName('script') : null;
        if (scripts != null) {
            var i = scripts.length;
            while (i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }
            return s.innerHTML;
        }
        else {
            return s;
        }
    };
    CheckerComponent.prototype.stripStyle = function (s) {
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
    CheckerComponent.prototype.chunkArray = function (arr, chunkSize) {
        var groups = [], i;
        for (i = 0; i < arr.length; i += chunkSize) {
            groups.push(arr.slice(i, i + chunkSize));
        }
        return groups;
    };
    CheckerComponent.prototype.showChanges = function (event, data) {
        var strText = this.textArea.nativeElement.value.split(" ");
        for (var i = 0; i < strText.length; i++) {
            for (var j = 0; j < data.length; j++) {
                var plagiatText = data[j];
                if (strText[i] == plagiatText) {
                    strText[i] = '<span style="color: #e23737;">' + strText[i] + '</span>';
                    break;
                }
            }
        }
        this.editText.nativeElement.innerHTML = "";
        this.editText.nativeElement.innerHTML = strText.join("&nbsp;");
    };
    return CheckerComponent;
}());
__decorate([
    core_1.ViewChild('textArea')
], CheckerComponent.prototype, "textArea", void 0);
__decorate([
    core_1.ViewChild(error_message_component_1.ErrorMessageComponent)
], CheckerComponent.prototype, "errorMsg", void 0);
__decorate([
    core_1.ViewChild('editText')
], CheckerComponent.prototype, "editText", void 0);
__decorate([
    core_1.ViewChild('analyzing')
], CheckerComponent.prototype, "analyzing", void 0);
__decorate([
    core_1.ViewChild('searching')
], CheckerComponent.prototype, "searching", void 0);
__decorate([
    core_1.ViewChild('determine')
], CheckerComponent.prototype, "determine", void 0);
__decorate([
    core_1.ViewChild('fillPercent')
], CheckerComponent.prototype, "fillPercent", void 0);
__decorate([
    core_1.ViewChild('checkBtn')
], CheckerComponent.prototype, "checkBtn", void 0);
__decorate([
    core_1.ViewChild('checkingBlock')
], CheckerComponent.prototype, "checkingBlock", void 0);
__decorate([
    core_1.ViewChild('textInfo')
], CheckerComponent.prototype, "textInfo", void 0);
__decorate([
    core_1.ViewChild('localText')
], CheckerComponent.prototype, "localText", void 0);
CheckerComponent = __decorate([
    core_1.Component({
        selector: 'app-checker',
        templateUrl: './checker.component.html',
        styleUrls: ['./checker.component.css'],
    })
], CheckerComponent);
exports.CheckerComponent = CheckerComponent;
