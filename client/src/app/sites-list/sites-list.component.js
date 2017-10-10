"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SitesListComponent = (function () {
    function SitesListComponent(indexService, route, cd, router) {
        this.indexService = indexService;
        this.route = route;
        this.cd = cd;
        this.router = router;
        this.sitesList = [];
        this.limit = 10;
        this.searchValue = "";
        this.index = 0;
        this.sitesCount = 0;
        this.page = 1;
    }
    SitesListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isMasked = true;
        this.indexService.getSitesByUserId({
            str: this.searchValue,
            skip: this.index,
            limit: this.limit
        }).then(function (result) {
            _this.sitesList = result.result;
            _this.sitesCount = result.count;
            _this.updatePageCount();
            _this.cd.detectChanges();
            _this.isMasked = false;
        });
    };
    SitesListComponent.prototype.check = function (url) {
        this.isMasked = true;
        this.indexService.notify(url);
        this.isMasked = false;
    };
    SitesListComponent.prototype.updatePageCount = function () {
        this.pageCounts = Math.ceil(this.sitesCount / this.limit);
        this.currentPage = this.index == 0 ? 1 : (this.index >= this.limit ? (Math.ceil(this.index / this.limit) + 1) : this.index);
    };
    SitesListComponent.prototype.onChange = function (value) {
        var _this = this;
        this.limit = parseInt(value);
        this.indexService.getSitesByUserId({
            str: this.searchValue,
            skip: this.index,
            limit: this.limit
        }).then(function (result) {
            _this.isMasked = false;
            _this.sitesList = result.result;
            _this.sitesCount = result.count;
        });
    };
    SitesListComponent.prototype.keyDownFunction = function (event) {
        var _this = this;
        var a = event.target.attributes.type.nodeValue;
        var val = event.target.value;
        this.searchValue = val;
        if (event.keyCode == 13) {
            event.preventDefault();
            this.isMasked = true;
            this.index = 0;
            this.indexService.getSitesByUserId({
                str: this.searchValue,
                skip: this.index,
                limit: this.limit
            }).then(function (result) {
                _this.isMasked = false;
                _this.sitesList = result.result;
                _this.sitesCount = result.count;
            });
        }
    };
    SitesListComponent.prototype.onKeyPress = function (event) {
        var _this = this;
        if (event.charCode === 13) {
            event.preventDefault();
            var value = parseInt(event.target.value);
            var pageCounts = Math.ceil(this.sitesCount / this.limit);
            this.index = value <= 0 ? 0 : (value >= pageCounts ? (pageCounts - 1) * this.limit : (value - 1) * this.limit);
            this.indexService.getSitesByUserId({
                str: this.searchValue,
                skip: this.index,
                limit: this.limit
            }).then(function (result) {
                _this.onSuccessPagination(result.result);
                _this.cd.detectChanges();
            });
        }
    };
    SitesListComponent.prototype.isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    SitesListComponent.prototype.onChangePage = function (e) {
        var res = this.isNumeric(e.target.value);
        if ((res || e.target.value == '') && e.target.value.length <= 3) {
            this.page = e.target.value;
        }
    };
    SitesListComponent.prototype.onNavigate = function (isNext, e) {
        var _this = this;
        if (isNext) {
            if (this.index < Math.ceil(this.sitesCount / this.limit)) {
                this.index += this.limit;
                this.list_previous.nativeElement.classList.remove('disable');
                if (this.index >= Math.ceil(this.sitesCount / this.limit)) {
                    this.list_next.nativeElement.classList.add('disable');
                }
            }
            else {
                return;
            }
        }
        else {
            if (this.index != 0) {
                this.index -= this.limit;
                this.list_next.nativeElement.classList.remove('disable');
                if (this.index == 0) {
                    this.list_previous.nativeElement.classList.add('disable');
                }
            }
            else {
                return;
            }
        }
        //  if (this.index < Math.ceil(this.sitesCount/this.limit)) {
        this.indexService.getSitesByUserId({
            str: this.searchValue,
            skip: this.index,
            limit: this.limit
        }).then(function (result) {
            _this.onSuccessPagination(result.result);
        });
        //  }
    };
    SitesListComponent.prototype.onSuccessPagination = function (data) {
        this.isMasked = false;
        this.updatePageCount();
        this.sitesList = data;
        this.page = this.currentPage;
        this.cd.detectChanges();
    };
    SitesListComponent.prototype.delete = function (event, id) {
        var _this = this;
        event.preventDefault();
        this.isMasked = true;
        this.indexService.deleteData(id).then(function (result) {
            _this.isMasked = false;
            _this.sitesList = result;
            // console.log(this.sitesList);
            // var deleteedObject = this.sitesList.filter(function(e) {
            //   return e.id = id
            // })
            //  var a = this.sitesList.indexof(deleteedObject);
            // console.log(a);
            // this.sitesList = result.result;
            //  this.sitesCount = this.sitesList.length;
            // this.sitesList = result.result.result[0];
            // console.log(result.result.result[0].domain);
        });
    };
    return SitesListComponent;
}());
__decorate([
    core_1.ViewChild('list_next')
], SitesListComponent.prototype, "list_next", void 0);
__decorate([
    core_1.ViewChild('list_previous')
], SitesListComponent.prototype, "list_previous", void 0);
SitesListComponent = __decorate([
    core_1.Component({
        selector: 'app-sites-list',
        templateUrl: './sites-list.component.html',
        styleUrls: ['./sites-list.component.css']
    })
], SitesListComponent);
exports.SitesListComponent = SitesListComponent;
