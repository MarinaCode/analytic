/**
 * Created by Marina on 16.12.2016.
 */
import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { IndexService } from '../services/index.service';
import { Router } from '@angular/router';
import { AuthenticationService }   from '../services/authentication.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css','./index.component.scss']
})
export class IndexComponent implements OnInit {
  url: string;
  data: string;
  isMasked:boolean;
  @ViewChild(LoginComponent) loginCmp: LoginComponent;

  constructor(private indexService: IndexService, private router: Router, private authService: AuthenticationService) {
    this.url = "";
  }

  check(url) {
    if(localStorage.length <= 0) {
      this.loginCmp.loginPopup(true);
    } else {
      this.isMasked = true;
      this.indexService.notifyCheckUrl(url);
      this.isMasked = false;
    }
  }

  ngOnInit(): void {
    this.isMasked = false;
  }
}
