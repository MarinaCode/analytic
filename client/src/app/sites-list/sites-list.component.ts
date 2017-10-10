import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import {document} from "@angular/platform-browser/src/facade/browser";

@Component({
  selector: 'app-sites-list',
  templateUrl: './sites-list.component.html',
  styleUrls: ['./sites-list.component.css']
})
export class SitesListComponent implements OnInit {
  sitesList:any = [];
  limit: number = 10;
  searchValue:string = "";
  index: number = 0;
  sitesCount: number = 0;
  page:number = 1;
  isMasked:boolean;
  @ViewChild('list_next') list_next: ElementRef;
  @ViewChild('list_previous') list_previous: ElementRef;
  public status: string;
  constructor(private indexService: IndexService, private route: ActivatedRoute, private cd: ChangeDetectorRef, private router: Router ) {  }

  ngOnInit() {
    this.isMasked = true;
    this.indexService.getSitesByUserId({
      str: this.searchValue,
      skip: this.index,
      limit: this.limit
    }).then((result) => {
      this.sitesList = result.result;
      this.sitesCount = result.count;
      if(this.sitesList == "") {
        document.getElementsByClassName('no-data')[0].setAttribute('style', 'display: block');
        document.getElementsByClassName('data-exist')[0].setAttribute('style', 'display: none');
      }
      this.isMasked = false;
    });
  }

  check(url) {
    this.isMasked = true;
    this.indexService.notifyCheckUrl(url);
    this.isMasked = false;
  }

  onChange(value) {
    this.limit = parseInt(value);
    this.indexService.getSitesByUserId({
      str: this.searchValue,
      skip: this.index,
      limit: this.limit
    }).then(result => {
      this.isMasked = false;
      this.sitesList = result.result;
      this.sitesCount = result.count;
    })
  }

  keyDownFunction(event) {
    var a = event.target.attributes.type.nodeValue;
    var val = event.target.value;
    this.searchValue = val;
    if(event.keyCode == 13) {
      event.preventDefault();
      this.isMasked = true;
      this.index = 0;
      this.indexService.getSitesByUserId({
        str: this.searchValue,
        skip: this.index,
        limit: this.limit
      }).then(result => {
        this.isMasked = false;
        this.sitesList = result.result;
        this.sitesCount = result.count;
      })
    }
  }

  onNavigate(data) {
      this.indexService.getSitesByUserId({
        str: this.searchValue,
        skip: data.index,
        limit: data.limit
      }).then((result) => {
        this.onSuccessPagination(result.result);
      });
  }

  onSuccessPagination(data) {
    this.isMasked = false;
    this.sitesList = data;
    this.cd.detectChanges();
    this.indexService.notifyPagination();
  }

  delete(event,id) {
    event.preventDefault();
    this.isMasked = true;
    this.indexService.deleteData(id).then(result => {
       this.isMasked = false;
       this.sitesList = result;
       if(this.sitesList == "") {
         document.getElementsByClassName('no-data')[0].setAttribute('style', 'display: block');
         document.getElementsByClassName('data-exist')[0].setAttribute('style', 'display: none');
       }

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
    })
  }
}
