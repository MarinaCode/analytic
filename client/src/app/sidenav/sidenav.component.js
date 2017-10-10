"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SidenavComponent = (function () {
    function SidenavComponent(indexService, authService) {
        this.indexService = indexService;
        this.authService = authService;
    }
    SidenavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.indexService.getUserById().subscribe(function (result) {
            var userInfo = result;
            _this.name = userInfo.first_name;
            _this.image = userInfo.image;
            _this.id = userInfo.id;
        });
        // let userStorage = JSON.parse(localStorage.getItem('currentUser'));
        // this.name = userStorage.first_name;
        // this.image = userStorage.image;
        // this.id = userStorage.id;
    };
    SidenavComponent.prototype.active = function (event) {
        event.preventDefault();
        event.currentTarget.classList.add("active");
    };
    return SidenavComponent;
}());
SidenavComponent = __decorate([
    core_1.Component({
        selector: 'app-sidenav',
        templateUrl: './sidenav.component.html',
        styleUrls: ['./sidenav.component.css']
    })
], SidenavComponent);
exports.SidenavComponent = SidenavComponent;
