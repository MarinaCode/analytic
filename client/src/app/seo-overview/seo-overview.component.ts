import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
var HighchartsMore = require("highcharts/highcharts-3d");
HighchartsMore(Highcharts);
var _ = require('underscore');
var striptags = require('striptags');

@Component({
  selector: 'app-seo-overview',
  templateUrl: './seo-overview.component.html',
  styleUrls: ['./seo-overview.component.scss']
})

export class SeoOverviewComponent implements OnInit {
  @Input() siteData : any;
  seoInfo: any;
  title: String;
  indexLinks: number = 0;
  indexUnderScoreLinks:number = 0;
  indexFollowLinks:number = 0;
  indexAlternatie: number = 0;
  allAlternativeCount: number = 0;
  page:number = 1;
  limit: number = 10;
  resultLong: string;
  resultShort: string;
  descriptionCount:number;
  metaData: string;
  metaDataCount:number = 0;
  metaDataAll:any;
  indexMetaData:number = 0;
  isMetaRobotExist: any;
  metaDataClass: number;
  metaRobotClass: number;
  metaRobotTextClass:  number;
  robotsText: any;
  siteMapClass: number;
  siteMapXML: any;
  canonicalClass:number;
  canonicalURL: any;
  alternative: any;
  alternativeClass: number;
  alternativeTextCount: number;
  externalPercent: number;
  allLinksCount: number;
  nonUnderscorePercent: number;
  nonUnderscoreCount: number;
  robotsTextLength: number;
  noFollow:any;
  allLinksData:any;
  allUnderscoreLinksData:any;
  allFollowLinksData:any;
  allAlternativeData:any;
  correctLinkClass: number;
  correctLinksCount: number;
  externalClass: number;
  underscoreClass:number;
  underScoreCount:number;
  internal: number;
  external: number;
  allLinks: any;
  underscorePercent: number;
  follow : any;
  followPercent : number;
  followClass: number;
  options: Object;
  seoScore:any = {
    follow: null,
    followPercent: 0,
    followClass: 0,
    nonUnderscorePercentClass: 0,
    nonUnderscorePercent: 0,
    underscorClass:0,
    underScoreCount:0,
    metaDescription: null,
    metaDescriptionClass:0,
    descriptionCount:0,
    correctLinkClass : 0,
    alternativeClass : 0,
    canonicalClass : 0,
    canonicalURL:null,
    siteMapClass : 0,
    metaRobotTextClass : 0,
    metaRobotClass : 0,
    robotsText: null,
    siteMapXML: null,
    robotsTextLength: 0,
    metaDataClass : 0,
    titleClass : 0,
    followData: [],
    metaData: [],
    correctLinks: [],
    correctLinksCount: 0,
    linkJuiceClass: 0,
    internal: 0,
    external: 0,
    allLinks: 0,
    externalPercent: 0,
    alternativeTextCount: 0,
    alternative: null,
    allLinksCount: 0,
    noFollow:null,
    externalClass: 0,
    underscorePercent: 0
  };
  domain : string;
  url: string;
  mainUrl: string;

  constructor(private indexService: IndexService, private route: ActivatedRoute) {  }

  ngOnInit() {
  }

  onNavigateLinks(data) {
    this.indexLinks = data.index;
    this.allLinksData = this.allLinks.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
  }

  onNavigateUnderscoreLinks(data) {
    this.indexUnderScoreLinks = data.index;//TODO show underscore links
    this.allUnderscoreLinksData = this.allLinks.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
  }

  onNavigateFollowLinks(data) {
    this.indexFollowLinks = data.index;//TODO show underscore links
    this.allFollowLinksData = this.allLinks.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
  }

  onNavigateMetaData(data) {
    this.indexMetaData = data.index;
    this.metaDataAll = this.metaData.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
  }

  onNavigateAlternative(data) {
    this.indexAlternatie = data.index;
    this.allAlternativeData = this.alternative.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
  }

  private stripTags(dom: any) {
    var el = this.createDOM(dom);
    var getSpan = el.getElementsByClassName("st");
    var strips = getSpan.length > 0 ? striptags(getSpan[0].innerHTML) : '';
    return strips;
  }

  private createDOM(dom: any) {
    var el = document.createElement( 'html' );
    el.innerHTML = dom;
    return el;
  }

  private sliceString(el: any, count: number) {
    return el != null && el.length > 0 ? el.slice(0,count) : '';
  }

  public show(event) {
    event.preventDefault();
    if(event.currentTarget.nextElementSibling.style.display == "none") {
      event.currentTarget.nextElementSibling.style.display = "block";
      event.currentTarget.classList.add("active");
    } else {
      event.currentTarget.nextElementSibling.style.display = "none";
      event.currentTarget.classList.remove("active");
    }
  }
}
