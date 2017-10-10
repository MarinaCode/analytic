import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
var HighchartsMore = require("highcharts/highcharts-more");

HighchartsMore(Highcharts);

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input() problematicData : any;
  @Input() validSeo : any;
  @Input() validContent : any;
  @Input() validDesign : any;
  @Input() validPerformance : any;
  @Input() validAccessibility : any;
  options: Object;

  constructor() { }

  ngOnInit() {
    let validSeo = Math.ceil(this.validSeo);
    let validPerformance = Math.ceil(this.validPerformance);
    let validDesign = Math.ceil(this.validDesign);
    let validContent =  Math.ceil(this.validContent);
    let validAccessibility = Math.ceil(this.validAccessibility);

    this.options = {

      chart: {
        polar: true,
        type: 'area',
        width: '400',
        height: '300'
      },
      colors: [
        '#dbe9ff'
      ],

      title: {
        text: ''
      },

      pane: {
        size: '90%'
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
        allowDecimals:true
      },

      tooltip: {
        enabled: false
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
  }
}
