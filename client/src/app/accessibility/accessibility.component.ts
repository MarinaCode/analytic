import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.css']
})
export class AccessibilityComponent implements OnInit {
  @Input() siteData : any;
  allDom: any;
  checkUrlForClean:boolean;
  domain: string;
  script_: boolean;
  getNoScript: boolean;
  getBgSound: boolean;
  favicon: boolean;
  getHTMLLang:any;
  openGraph: {};
  ogDescription:string;
  ogImage: string;
  ogSite_name: string ;
  ogTitle:string;
  ogType:any;
  ogUrl:any;
  twitterImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterCard: string;
  publisher: string;
  viewPort:boolean;

  accessibilityScore: any = {
    good: 0,
    bad: 0,
    perfect: 0,
    checkUrlForClean: null,
    domain: '',
    script_: false,
    getNoScript: false,
    getBgSound: false,
    favicon: false,
    getHTMLLang: null,
    openGraph: null,
    publisher:'',
    viewPort: 0,
  }
  constructor(private indexService: IndexService, private route: ActivatedRoute) { }

  ngOnInit() {
  }
}
