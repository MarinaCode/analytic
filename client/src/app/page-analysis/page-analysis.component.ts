import {
  Component, ChangeDetectorRef, OnInit, ViewEncapsulation, ViewChild, EventEmitter,
  ElementRef
} from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router} from '@angular/router';
var sizeof = require('object-sizeof');
var _ = require('underscore');
import { Utils } from '../utils/utils';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { AuthenticationService }   from '../services/authentication.service';
import { environment } from '../../environments/environment';

// var striptags = require('striptags');
@Component({
  selector: 'app-page-analysis',
  templateUrl: 'page-analysis.component.html',
  styleUrls: ['page-analysis.component.css','page-analysis.component.scss'],
  encapsulation:ViewEncapsulation.None
})

export class PageAnalysisComponent implements OnInit {
  siteData: any;
  options: Object;
  problematicData: any = [];
  sub: any;
  validPerformance: any = 0;
  validDesign: any = 0;
  validSeo: any = 0;
  validContent: any = 0;
  validAccessibility: any = 0;
  valid: number = 0;
  warning: number = 0;
  critical: number = 0;
  url: string;
  data: string;
  mainUrl: string;
  fullUrl: string;
  lastCheck: any;
  average: any;
  screenshot: any;
  isMasked: boolean;

  @ViewChild(ErrorMessageComponent) errorMsg: ErrorMessageComponent;
  @ViewChild('diagram1') diagram1: ElementRef;
  @ViewChild('diagram2') diagram2: ElementRef;
  @ViewChild('diagram3') diagram3: ElementRef;
  @ViewChild('diagram4') diagram4: ElementRef;

  constructor(private indexService: IndexService, private cd: ChangeDetectorRef, private router: Router, private authService: AuthenticationService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.isMasked = true;
    this.sub = this.route.params.subscribe(params => {
      var siteId = params['id'];
      this.indexService.getSiteByUser(siteId).subscribe((result) => {
        this.siteData = JSON.parse(result.data);
        this.mainUrl = this.siteData.data.mainUrl;
        this.validPerformance = this.siteData.performanceScore.validPerformance;
        this.validDesign = this.siteData.designScore.validDesign;
        this.validSeo = this.siteData.seoScore.validSeo;
        this.validContent = this.siteData.contentScore.validContent;
        this.validAccessibility = this.siteData.accessibilityScore.validAccessibility;
        this.fullUrl = this.siteData.data.url;
        this.lastCheck = this.siteData.data.lastCheck;
        this.screenshot = environment.mainUrl +"images/" + this.siteData.data.screenShot;
        this.siteData.seoScore.problematicData.forEach((el) => {
          this.problematicData.push(el);
        });
        this.siteData.designScore.problematicData.forEach((el) => {
          this.problematicData.push(el);
        });
        this.siteData.contentScore.problematicData.forEach((el) => {
          this.problematicData.push(el);
        });
        this.siteData.performanceScore.problematicData.forEach((el) => {
          this.problematicData.push(el);
        });
        this.siteData.accessibilityScore.problematicData.forEach((el) => {
          this.problematicData.push(el);
        });
        this.valid = this.siteData.valid;
        this.warning = this.siteData.warning;
        this.critical = this.siteData.critical;

        this.average = result.score;
        this.isMasked = false;

        let critical = this.critical;
        let warning = this.warning;
        let valid = this.valid;
        let average = this.average;

        this.diagram1.nativeElement.setAttribute('style', 'width: '+critical+'%');
        this.diagram2.nativeElement.setAttribute('style', 'width: '+warning+'%');
        this.diagram3.nativeElement.setAttribute('style', 'width: '+valid+'%');
        this.diagram4.nativeElement.setAttribute('style', 'width: '+average+'%');


      }, err => {
        if (err.message) {
          this.isMasked = false;
          this.router.navigate(['/index']);
        }
      });
    })
  }

}
