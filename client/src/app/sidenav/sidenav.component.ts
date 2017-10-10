import { Component, OnInit } from '@angular/core';
import { AuthenticationService }   from '../services/authentication.service';
import { IndexService }   from '../services/index.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  isShow: boolean;
  name: string;
  image:string;
  id: any;
  JSON: any;
  localStorage:any;

  constructor(private indexService: IndexService, private authService: AuthenticationService ) {
    this.JSON = JSON;
    this.indexService.notifierSubjectUpdateImage.subscribe(image => {this.changeImage(image) });
    this.indexService.notifierSubjectUserChange.subscribe(userData => {this.changeUserData(userData) });
    this.localStorage = localStorage;
  }

  changeImage(image: any) {
    this.image = image;
  }

  changeUserData(userData: any) {
    if (!this.authService.loggedIn()) {
      this.isShow = false;
    } else {
      this.isShow = true;
      this.name = userData.first_name;
      this.image = userData.image;
    }
  }

  ngOnInit() {
    // let userStorage = JSON.parse(localStorage.getItem('currentUser'));
    // this.name = userStorage.first_name;
    // this.image = userStorage.image;
    // this.id = userStorage.id;
  }

  public active(event) {
    event.preventDefault();
    event.currentTarget.classList.add("active");
  }
}
