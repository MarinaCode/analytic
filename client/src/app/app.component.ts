import { Component, ViewChild } from '@angular/core';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import { IndexService } from './services/index.service';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  @ViewChild(ErrorMessageComponent) errorMsg: ErrorMessageComponent;
  isMasked: boolean;


  constructor(private _translate: TranslateService, private indexService:IndexService, private router: Router ) {
    this._translate.use('en');
    this.indexService.getUserById().subscribe(result => {
      var userInfo = result;
      this.indexService.notifyUserChange(userInfo);
      // this.router.navigate(['/dashboard']);
    },
    err => {
     localStorage.removeItem('currentUser');
    });
    this.indexService.notifierSubjectCheckUrl.subscribe(url => {this.check(url) });
  }

  check(url: string): void {
    var valid = this.checkURL(url);
    var data: any = {};
    var mainUrl = "";
    var domain = "";
    if (valid) {
      this.isMasked = true;
      this.indexService.check(url).subscribe((result) => {
          data = result;
          mainUrl = result.mainUrl;
          domain = result.domain;
          var path = "https://www.google.com/search?q=" + encodeURIComponent(mainUrl);
          this.indexService.getAllData(url, mainUrl, path ).subscribe((allResult) => {
            data.siteMapResult = allResult[0];
            data.googleResult = allResult[1];
            data.favicon = allResult[2];
            data.robotResult = allResult[3];
            data.time = allResult[4];
            data.screenShot = allResult[5].result;
            data.fullUrl = url;
            let getDate = new Date();
            let day = getDate.getDate();
            let month = getDate.getMonth() + 1;
            let year =  getDate.getFullYear();
            data.lastCheck = day + ":" + month + ":" + year;
            this.indexService.saveData(data, domain ).subscribe((res) => {
              this.router.navigate(['/page-analysis/' + res.json().id]);
              this.isMasked = false;
            })
          });
        },
        err => {
          this.isMasked = false;
          this.errorMsg.showErrorMessage(err.error);
        }
      );
    } else {
      this.isMasked = false;
      this.errorMsg.showErrorMessage("Oops !!! An error occured.Please enter a valid url.");
    }
  }

  checkURL(url: string) {
    var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
    return valid;
  }
}
