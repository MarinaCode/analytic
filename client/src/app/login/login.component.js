"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("../utils/utils");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/interval");
var LoginComponent = (function () {
    function LoginComponent(indexService, authService, router, fb) {
        this.indexService = indexService;
        this.authService = authService;
        this.router = router;
        this.fb = fb;
        this.loginVisiblity = true;
        this.signUpVisiblity = false;
        this.resetVisibility = false;
        this.loading = false;
        this.isLogIn = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.isLogIn = this.authService.loggedIn();
        this.loginVisiblity = this.loginPopup(false);
        var fbParams = {
            appId: '1815063992103357',
            xfbml: true,
            version: 'v2.5'
        };
        this.fb.init(fbParams);
    };
    LoginComponent.prototype.closeLogin = function () {
        this.loginVisiblity = false;
        this.resetVisibility = false;
    };
    LoginComponent.prototype.closeSignup = function () {
        this.signUpVisiblity = false;
    };
    LoginComponent.prototype.logout = function () {
        var _this = this;
        this.authService.logout().subscribe(function (result) {
            _this.isLogIn = false;
            _this.router.navigate(['/index']);
        });
    };
    LoginComponent.prototype.signUpPopup = function () {
        this.closeLogin();
        this.signUpVisiblity = true;
    };
    LoginComponent.prototype.resetPassword = function () {
        this.closeLogin();
        this.resetVisibility = true;
        this.signUpVisiblity = false;
    };
    LoginComponent.prototype.loginFacebook = function () {
        var _this = this;
        var params = {
            scope: 'email'
        };
        this.fb.getLoginStatus().then(function (result) {
            _this.fb.login(params).then(function (response) {
                _this.collectData();
            }, function (error) { return console.error(error); });
        });
    };
    LoginComponent.prototype.authenticated = function () {
        if (this.authenticatedObs)
            return this.authenticatedObs;
        this.authenticatedObs = this.authService.authenticated()
            .map(function (data) { return data; });
        return this.authenticatedObs;
    };
    LoginComponent.prototype.loginGoogle = function () {
        var _this = this;
        var popupWidth = 700, popupHeight = 500, popupLeft = (window.screen.width - popupWidth) / 2, popupTop = (window.screen.height - popupHeight) / 2;
        var newWindow = window.open('http://localhost:3000/analytic/api/v1/users/loginGoogle', 'Login', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + popupLeft + ',top=' + popupTop + '');
        if (window.focus) {
            newWindow.focus();
        }
        var source = Observable_1.Observable.interval(3000).map(function () {
            _this.authenticated().subscribe(function (data) {
                if (data && data != "") {
                    newWindow.close();
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    _this.loginVisiblity = false;
                    _this.authSub.unsubscribe();
                    _this.router.navigate(['/dashboard']);
                }
            });
        });
        this.authSub = source.subscribe();
    };
    LoginComponent.prototype.collectData = function () {
        var self = this;
        this.fb.api('/me', null, { fields: 'id,name,email,first_name,gender,picture.width(150).height(150)' })
            .then(function (result) {
            if (result && !result.error) {
                self.indexService.saveUser(result).then(function (data) {
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    self.loginVisiblity = false;
                    self.router.navigate(['/dashboard']);
                });
            }
            else {
                console.log(result.error);
            }
        });
    };
    LoginComponent.prototype.loginPopup = function (loginVisibility) {
        this.closeSignup();
        this.loginVisiblity = loginVisibility;
        return this.loginVisiblity;
    };
    LoginComponent.prototype.login = function (username, password) {
        var _this = this;
        this.loading = true;
        this.authService.login(username, password)
            .subscribe(function (result) {
            if (result === true) {
                _this.router.navigate(['/dashboard']);
            }
            else {
                _this.loading = false;
            }
        }, function (err) {
            //TODO add error style here
            _this.error = 'Username or password is incorrect';
            // TODO Make username and password fields  red !!!
        });
    };
    LoginComponent.prototype.signUp = function (username, email, password, confirmPassword) {
        var _this = this;
        debugger;
        if (this.check['_checked']) {
            this.check['_elementRef'].nativeElement.setAttribute("style", "color:#7f7f7f");
            if (utils_1.Utils.regEmail(email)) {
                var isValidPass = true;
                if (password.length < 8 || username > 10) {
                    isValidPass = false;
                }
                else {
                    if (password !== confirmPassword) {
                        isValidPass = false;
                    }
                }
                if (isValidPass) {
                    var data = {
                        username: username,
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword,
                        checked: this.check['checked']
                    };
                    this.indexService.createUser(data).then(function (data) {
                        //localStorage.setItem('currentUser', JSON.stringify(data.result));
                        _this.closeSignup();
                        //this.router.navigate(['/dashboard']);
                    });
                }
            }
            else {
                //error style(mark the field red)
                //this.signupEmail.nativeElement
            }
        }
        else {
            this.check['_elementRef'].nativeElement.setAttribute("style", "color:red");
        }
    };
    LoginComponent.prototype.resetPass = function (email) {
        var _this = this;
        if (utils_1.Utils.regEmail(email)) {
            var data = {
                email: email
            };
            this.indexService.resetPass(data).then(function (data) {
                //localStorage.setItem('currentUser', JSON.stringify(data.result));
                _this.closeSignup();
                //this.router.navigate(['/dashboard']);
            });
        }
        else {
            //TODO
            //  set field red color
        }
    };
    return LoginComponent;
}());
__decorate([
    core_1.ViewChild('signupEmail')
], LoginComponent.prototype, "signupEmail", void 0);
__decorate([
    core_1.ViewChild('check')
], LoginComponent.prototype, "check", void 0);
__decorate([
    core_1.ViewChild('email')
], LoginComponent.prototype, "email", void 0);
__decorate([
    core_1.ViewChild('pass')
], LoginComponent.prototype, "pass", void 0);
__decorate([
    core_1.ViewChild('passconfirm')
], LoginComponent.prototype, "passconfirm", void 0);
LoginComponent = __decorate([
    core_1.Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
exports.LoginComponent = LoginComponent;
