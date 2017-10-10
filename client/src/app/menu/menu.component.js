"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MenuComponent = (function () {
    function MenuComponent(indexService, _translate, route) {
        this.indexService = indexService;
        this._translate = _translate;
        this.route = route;
        this.backend = true;
        this.homepage = false;
    }
    MenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        var snapshot = this.route.snapshot;
        if (snapshot.routeConfig.path == 'index' || snapshot.routeConfig.path == "") {
            this.homepage = true;
            this.backend = false;
        }
        else {
            this.backend = true;
            this.homepage = false;
        }
        // console.log(snapshot..component.name); //This will give you the name of current active component
        this.indexService.getUserById().subscribe(function (result) {
            var userInfo = result;
            _this.name = userInfo.first_name;
            _this.image = userInfo.image;
            _this.id = userInfo.id;
        });
        // standing data
        this.supportedLangs = [
            { display: 'English', value: 'en' },
            { display: 'Русский', value: 'ru' },
            { display: 'Italiano', value: 'it' },
        ];
    };
    MenuComponent.prototype.isCurrentLang = function (lang) {
        return lang === this._translate.currentLang;
    };
    MenuComponent.prototype.selectLang = function (lang) {
        // set default;
        this._translate.use(lang);
        this.refreshText();
    };
    MenuComponent.prototype.refreshText = function () {
        this.translatedText = this._translate.instant('hello world');
    };
    MenuComponent.prototype.change = function (event) {
        var node = event.currentTarget;
        var parent = node.parentNode;
        var prev = parent.firstChild;
        if (prev == node)
            return false;
        var oldChild = parent.removeChild(node);
        parent.insertBefore(oldChild, prev);
    };
    return MenuComponent;
}());
__decorate([
    core_1.Input()
], MenuComponent.prototype, "data", void 0);
MenuComponent = __decorate([
    core_1.Component({
        selector: 'menu-detail',
        templateUrl: 'menu.component.html',
        styleUrls: ['menu.component.css']
        // directives: [LoginComponent]
    })
], MenuComponent);
exports.MenuComponent = MenuComponent;
