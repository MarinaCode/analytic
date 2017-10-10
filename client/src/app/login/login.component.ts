import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService }   from '../services/authentication.service';
import { Router } from '@angular/router';
import { IndexService }   from '../services/index.service';
import { Utils } from '../utils/utils';
import {FacebookService, FacebookLoginResponse, FacebookInitParams, FacebookLoginOptions} from 'ng2-facebook-sdk/dist';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginVisiblity: boolean = true;
  signUpVisiblity: boolean = false;
  resetVisibility: boolean = false;
  processing: boolean = false;
  userExist: boolean = false;
  checkoutEmailPopup: boolean = false;
  checkoutEmailForResetPassPopup: boolean = false;
  signup: boolean = true;
  socket = null;
  loading = false;
  @ViewChild('signupEmail') signupEmail: ElementRef;
  @ViewChild('check') check: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('pass') pass: ElementRef;
  @ViewChild('passconfirm') passconfirm: ElementRef;
  @ViewChild('signupBtn') signupBtn: ElementRef;
  @ViewChild('usernameLength') usernameLength: ElementRef;
  @ViewChild('passLength') passLength: ElementRef;
  @ViewChild('confirmPassErr') confirmPassErr: ElementRef;
  @ViewChild('loginError') loginError: ElementRef;
  @ViewChild('signupPopup') signupPopup: ElementRef;
  @ViewChild('resetEmail') resetEmail: ElementRef;
  @ViewChild('emailErr') emailErr: ElementRef;
  error: any;
  authenticatedObs: Observable<boolean>;
  isLogIn = false;
  constructor(private indexService: IndexService, private authService: AuthenticationService, private router: Router, private fb: FacebookService) { }

  ngOnInit(): void {
    this.isLogIn = this.authService.loggedIn();
    this.loginVisiblity = this.loginPopup(false);
    let fbParams: FacebookInitParams = {
      appId: '1815063992103357',
      xfbml: true,
      version: 'v2.5'
    };
    this.fb.init(fbParams);
  }

  closeLogin() {
    this.loginVisiblity = false;
    this.resetVisibility = false;
    document.body.style.overflowY = 'auto';
  }

  closeSignup() {
    this.signUpVisiblity = false;
    this.resetVisibility = false;
    document.body.style.overflowY = 'auto';
  }

  logout() {
    this.authService.logout().subscribe(result => {
      this.isLogIn = false;
      this.router.navigate(['/index']);
      this.indexService.notifyUserChange(result);
    });
  }

  signUpPopup() {
    this.closeLogin();
    this.signUpVisiblity = true;
    document.body.style.overflowY = 'hidden';
  }

  resetPassword() {
    this.closeLogin();
    this.resetVisibility = true;
    this.signUpVisiblity = false;
    document.body.style.overflowY = 'hidden';
  }

  loginFacebook() {
    let params: FacebookLoginOptions = {
      scope: 'email'
    }
    this.fb.getLoginStatus().then((result) => {
      this.fb.login(params).then(
        (response: FacebookLoginResponse) => {
          this.collectData();
          this.closeSignup();
        },
        (error: any) => console.error(error)
      );
    })
  }

  authenticated(): Observable<any> {
    if (this.authenticatedObs) return this.authenticatedObs;
    this.authenticatedObs = this.authService.authenticated()
      .map(data => {return data});
    return this.authenticatedObs;
  }

  loginGoogle() {
    var popupWidth = 700,
      popupHeight = 500,
      popupLeft = (window.screen.width - popupWidth) / 2,
      popupTop = (window.screen.height - popupHeight) / 2;
    var newWindow = window.open(environment.apiUrl + 'users/loginGoogle', 'Login', 'width='+popupWidth+',height='+popupHeight+',left='+popupLeft+',top='+popupTop+'');
    if (window.focus) {
      newWindow.focus();
    }

    let source = Observable.interval(3000).map(() => {
      this.authenticated().subscribe(data => {
        if (data && data != "") {
          newWindow.close();
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.indexService.notifyUserChange(data);
          this.socket = io('http://localhost:3000');
          this.socket.emit('join', {id: data.id});
          this.loginVisiblity = false;
          this.closeSignup();
          this.authService.authSub.unsubscribe();
          this.router.navigate(['/dashboard']);
        }
      })
    })
    this.authService.authSub = source.subscribe();
  }

  collectData() {
    this.fb.api('/me', null, {fields: 'id,name,email,first_name,gender,picture.width(150).height(150)'})
      .then(
        (result)=> {
          if (result && !result.error) {
            //emailType 2 facebook
            this.indexService.saveUser(result, 2).then(data => {
              localStorage.setItem('currentUser', JSON.stringify(data));
              this.socket = io('http://localhost:3000');
              this.socket.emit('join', {id: data.id});
              this.indexService.notifyUserChange(data);
              this.loginVisiblity = false;
              this.router.navigate(['/dashboard']);
            });
          } else {
            console.log (result.error);
          }
        });
  }

  loginPopup(loginVisibility) {
    this.closeSignup();
    this.loginVisiblity = loginVisibility;
    if(loginVisibility) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
    return this.loginVisiblity;
  }

  login(username, password) {
    this.loading = true;
    this.authService.login(username, password)
      .subscribe(result => {
        this.loginError.nativeElement.style.display = 'none';
        if (result) {
          this.indexService.notifyUserChange(result);
          this.socket = io('http://localhost:3000');
          this.socket.emit('join', {id: result.id});
          this.loginVisiblity = false;
          document.body.style.overflowY = 'auto';
          this.router.navigate(['/dashboard']);
        } else {
          this.loading = false;
        }
      }, err => {
        //TODO add error style here
        this.loginError.nativeElement.style.display = 'inline';
        this.error = 'Username or password is incorrect';
        // TODO Make username and password fields  red !!!
      });
  }

  signUp(username, email, password, confirmPassword) {
    this.usernameLength.nativeElement.innerText = 'max 10 symbol';
    if(username.trim().length > 10) {
      this.usernameLength.nativeElement.innerText = 'max 10 symbol';
      this.usernameLength.nativeElement.classList.add('input-error-message');
    } else if(username.trim().length != 0) {
      this.usernameLength.nativeElement.classList.remove('input-error-message');
    }
    if(password.trim().length < 8) {
      this.passLength.nativeElement.classList.add('input-error-message');
    } else {
      this.passLength.nativeElement.classList.remove('input-error-message');
    }
    if (password.trim() !== confirmPassword.trim()) {
      this.confirmPassErr.nativeElement.classList.add('input-error-message');
    } else {
      this.confirmPassErr.nativeElement.classList.remove('input-error-message');
    }
    if( this.check['_checked']) {
      this.check['_elementRef'].nativeElement.setAttribute("style", "color:#7f7f7f");
      if (Utils.regEmail(email) && username.trim().length > 0) {
        var isValidPass = true;
        if (password.trim().length < 8 || username.trim().length > 10) {
          isValidPass = false;
        } else {
          if (password !== confirmPassword) {
            isValidPass = false;
          }
        }
        if (isValidPass) {
          var data = {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            checked: this.check['checked']
          }
          this.processing = true;
          this.signup = false;
          this.indexService.createUser(data).then(data => {
            //localStorage.setItem('currentUser', JSON.stringify(data.result));
            this.signup = true;
            this.signUpVisiblity = false;
            this.checkoutEmailPopup = true;
            //this.router.navigate(['/dashboard']);
          });
        }
      } else if(!username){
        //error style(mark the field red)
        this.usernameLength.nativeElement.innerText = 'Username field is empty';
        this.usernameLength.nativeElement.classList.add('input-error-message');
        //this.signupEmail.nativeElement
      } else if(!Utils.regEmail(email)) {
        this.emailErr.nativeElement.style.display = 'inline';
      }
    } else {
      this.check['_elementRef'].nativeElement.setAttribute("style", "color:red")
    }
  }

  hideCheckoutEmailPopup($event) {
    this.checkoutEmailPopup = false;
    this.checkoutEmailForResetPassPopup = false;
    document.body.style.overflowY = 'auto';
  }

  resetPass(email) {
    if (Utils.regEmail(email)) {
      var data = {
        email:email
      }
      this.indexService.resetPass(data).then(data => {
        //localStorage.setItem('currentUser', JSON.stringify(data.result));
        this.resetVisibility = false;
        this.checkoutEmailForResetPassPopup = true;
        document.body.style.overflowY = 'auto';
        //this.router.navigate(['/dashboard']);
      }).catch(err => {
        this.resetEmail.nativeElement.style.borderColor = 'rgb(180, 51, 37)';
        console.log(err);
      });

    } else {
      //TODO
      this.resetEmail.nativeElement.style.borderColor = 'rgb(180, 51, 37)';
      //  set field red color
    }
  }
}
