import { Component, OnInit } from '@angular/core';
import { AuthenticationService }   from '../services/authentication.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  public blogLogin: boolean = false;
  public blogLogout: boolean = true;

  ngOnInit(): void {
    var login = false;
    if(login) {
      this.blogLogout = false;
      this.blogLogin = true;
    } else {
      this.blogLogout = true;
      this.blogLogin = false;
    }
    if(this.authService.loggedIn()) { //we need to find the best way to understand user is loggedIn or not
      this.blogLogin = true;
      this.blogLogout = false;
    }
    else {
      this.blogLogin = false;
      this.blogLogout = true;
    }
  }
}
