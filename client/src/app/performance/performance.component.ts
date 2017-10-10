import { Component, OnInit, Input} from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
var _ = require("underscore.string");
// var striptags = require('striptags');

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css'],
})

export class PerformanceComponent implements OnInit {
  @Input() siteData : any;
  caching: any;
  url: any;
  mainUrl: any;
  contentLength:number;
  contentLengthClass:number;
  time: number;
  timeClass: number;

  performanceScore: any = {
    good: 0,
    bad: 0,
    perfect: 0,
    caching: null,
    inlineClass: 0,
    inlineStyles: null,
    cachingClass: 0,
    scriptClass: 0,
    locatedCriptsClass: 0,
    stylesClass: 0,
    realScriptsPercent: 0,
    realStylePercent: 0,
    locatedScripts: 0,
    contentLength: 0,
    contentLengthClass:0,
    time: 0,
    timeClass: 0
  };
  constructor(private indexService: IndexService, private route: ActivatedRoute) { }

  ngOnInit() {

  }

}
