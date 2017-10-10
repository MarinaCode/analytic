import { Component, Input, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import { AuthenticationService }   from '../services/authentication.service';
import {userInfo} from "os";

declare var introJs: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', './dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  data: any;
  name: string;
  image:string;
  id: any;
  seoBalance: number;
  checkerBalance: number;
  userRole: any;
  pageAnalyzeBalance: number;
  plagiarismCheckerBalance : number;


  constructor(private indexService: IndexService, private authService: AuthenticationService, private router: Router, private _translate: TranslateService) {}
  ngOnInit() {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/index']);
    }
    this.data = this.indexService.data;
    this.indexService.getUserById().subscribe(result => {
      this.authService.authSub.unsubscribe();
      var userInfo = result;
      this.name = userInfo.first_name;
      this.image = userInfo.image;
      this.id = userInfo.id;
      this.seoBalance = userInfo.seoTries;
      this.checkerBalance = userInfo.checkerTries;
      this.userRole = userInfo.role == 0 ? "Basic" : userInfo.role == 1 ? "Standard" :  "Premium";

      if( userInfo.role == 0 ) {
        this.userRole = "Basic";
        this.pageAnalyzeBalance = 10;
        this.plagiarismCheckerBalance = 1000;
      } else if( userInfo.role == 1) {
        this.userRole = "Standard";
        this.pageAnalyzeBalance = 15;
        this.plagiarismCheckerBalance = 2000;
      } else {
        this.userRole = "Premium";
        this.pageAnalyzeBalance = 20;
        this.plagiarismCheckerBalance = 5000;
      }

    },
    err => {
      this.authService.authSub.unsubscribe();
      this.authService.logout();
    });
  }

  isCurrentLang(lang: string) {
    return lang === this._translate.currentLang;
  }

  selectLang(lang: string) {
    this._translate.use(lang);
  //  this.refreshText();
  }

  demo() {
    introJs().start();
  }
}
