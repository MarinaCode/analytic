import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';

// var sizeof = require('object-sizeof');
// var striptags = require('striptags');
// var _ = require("underscore");

@Component({
  selector: 'app-analysis-content',
  templateUrl: './analysis-content.component.html',
  styleUrls: ['./analysis-content.component.scss']
})

export class AnalysisContentComponent implements OnInit {
  @Input() siteData : any;
  limit:number = 10;
  indexKeyword1:number;
  indexKeyword2:number;
  indexKeyword3:number;
  keyword1All:any = [];
  keyword2All:any = [];
  keyword3All:any = [];
  keywordCountArray1: any = [];
  keywordCountArray2: any = [];
  keywordCountArray3: any = [];
  url:string;
  @ViewChild('diagram5') diagram5: ElementRef;
  @ViewChild('diagram6') diagram6: ElementRef;
  @ViewChild('diagram7') diagram7: ElementRef;
  cloudData: any = [];
  contentScore: any = {
    percentsInText : 0,
    percentsInTextClass : 0,
    countInfo: 0,
    countInfoClass: 0,
    titleCohance: 0,
    titleCohanceClass: 0,
    keywordRepetition: 0,
    quantityKeyword : 0,
    microdataArrayClass: 0,
    microdataArray: null,
    checkTitle: null,
    cloudData: null
  }

  constructor(private indexService: IndexService, private route: ActivatedRoute) { }

  ngOnInit() {

  }

  onNavigateKeyword1(data) {
    this.indexKeyword1 = data.index;
    this.keyword1All = this.keywordCountArray1.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
  }

  onNavigateKeyword2(data) {
    this.indexKeyword2 = data.index;
    this.keyword2All = this.keywordCountArray2.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
  }

  onNavigateKeyword3(data) {
    this.indexKeyword3 = data.index;
    this.keyword3All = this.keywordCountArray3.slice(data.index == 0 ? data.index : data.index , data.index == 0 ? data.limit : data.index + data.limit);
    this.indexService.notifyPagination();
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
