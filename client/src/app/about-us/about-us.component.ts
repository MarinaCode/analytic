import { Component, OnInit } from '@angular/core';
import { AuthenticationService }   from '../services/authentication.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  public aboutUsLogout: boolean = true;
  public aboutUsLogin: boolean = false;

  ngOnInit(): void {
    var login = false;
    if(login) {
      this.aboutUsLogout = false;
      this.aboutUsLogin = true;
    } else {
      this.aboutUsLogout = true;
      this.aboutUsLogin = false;
    }

    if(this.authService.loggedIn()) {
      this.aboutUsLogin = true;
      this.aboutUsLogout = false;
    }
    else {
      this.aboutUsLogin = false;
      this.aboutUsLogout = true;
    }

  }

}
