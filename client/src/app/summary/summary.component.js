"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Highcharts = require("highcharts");
var HighchartsMore = require("highcharts/highcharts-more");
HighchartsMore(Highcharts);
var SummaryComponent = (function () {
    function SummaryComponent() {
    }
    SummaryComponent.prototype.ngOnInit = function () {
        var validSeo = Math.ceil(this.validSeo);
        var validPerformance = Math.ceil(this.validPerformance);
        var validDesign = Math.ceil(this.validDesign);
        var validContent = Math.ceil(this.validContent);
        var validAccessibility = Math.ceil(this.validAccessibility);
        this.options = {
            chart: {
                polar: true,
                type: 'area'
            },
            colors: [
                '#dbe9ff'
            ],
            title: {
                text: '',
            },
            pane: {
                size: '100%'
            },
            xAxis: {
                categories: ['SEO', 'Performance', 'Design', 'Content ', 'Accessibility'],
                tickmarkPlacement: 'off',
                lineWidth: 0
            },
            credits: {
                enabled: false
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                allowDecimals: true
            },
            tooltip: {
                shared: false,
                pointFormat: false
            },
            legend: {
                align: 'right',
                verticalAlign: 'bottom'
                // layout: 'vertical'
            },
            series: [{
                    name: " ",
                    pointPlacement: 'off',
                    data: [validSeo, validPerformance, validDesign, validContent, validAccessibility],
                    fillColor: '#dbe9ff',
                    fillOpacity: 0.2
                }]
        };
    };
    return SummaryComponent;
}());
__decorate([
    core_1.Input()
], SummaryComponent.prototype, "problematicData", void 0);
__decorate([
    core_1.Input()
], SummaryComponent.prototype, "validSeo", void 0);
__decorate([
    core_1.Input()
], SummaryComponent.prototype, "validContent", void 0);
__decorate([
    core_1.Input()
], SummaryComponent.prototype, "validDesign", void 0);
__decorate([
    core_1.Input()
], SummaryComponent.prototype, "validPerformance", void 0);
__decorate([
    core_1.Input()
], SummaryComponent.prototype, "validAccessibility", void 0);
__decorate([
    core_1.Input()
], SummaryComponent.prototype, "summary", void 0);
SummaryComponent = __decorate([
    core_1.Component({
        selector: 'app-summary',
        templateUrl: './summary.component.html',
        styleUrls: ['./summary.component.css']
    })
], SummaryComponent);
exports.SummaryComponent = SummaryComponent;
