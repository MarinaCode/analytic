import { Component, OnInit } from '@angular/core';
import { AuthenticationService }   from '../services/authentication.service';

@Component({
  selector: 'app-terms-of-services',
  templateUrl: './terms-of-services.component.html',
  styleUrls: ['./terms-of-services.component.css']
})
export class TermsOfServicesComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  public termsLogin: boolean = false;
  public termsLogout: boolean = false;

  ngOnInit(): void {
    var login = false;
    if(login) {
      this.termsLogin = true;
      this.termsLogout = false;
    }
    else {
      this.termsLogin = false;
      this.termsLogout = true;
    }
    if(this.authService.loggedIn()) {
      this.termsLogin = true;
      this.termsLogout = false;
    }
    else {
      this.termsLogin = false;
      this.termsLogout = true;
    }
  }

}
