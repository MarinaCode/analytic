"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ActivationComponent = (function () {
    function ActivationComponent(indexService, authService, route, router) {
        this.indexService = indexService;
        this.authService = authService;
        this.route = route;
        this.router = router;
    }
    ActivationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isActivated = false;
        this.route.params.subscribe(function (params) {
            var id = params['id'];
            _this.indexService.activateEmail(id).subscribe(function (result) {
                if (result.error) {
                    _this.router.navigate(['/index']);
                }
                else {
                    _this.isActivated = true;
                    setTimeout(function () {
                        _this.router.navigate(['/index']);
                    }, 2000);
                }
            }, function (err) {
                if (err.message) {
                    _this.router.navigate(['/index']);
                }
            });
        });
    };
    return ActivationComponent;
}());
ActivationComponent = __decorate([
    core_1.Component({
        selector: 'app-activation',
        templateUrl: './activation.component.html',
        styleUrls: ['./activation.component.css']
    })
], ActivationComponent);
exports.ActivationComponent = ActivationComponent;
