import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService }   from '../services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isActivated: boolean;
  @ViewChild('password') pass: ElementRef;
  @ViewChild('confirmPassword') passconfirm: ElementRef;
  @ViewChild('resetPassSymbolErr') resetPassSymbolErr: ElementRef;
  @ViewChild('resetPassConfirmPass') resetPassConfirmPass: ElementRef;
  constructor(private indexService: IndexService, private authService: AuthenticationService, private route: ActivatedRoute, private router: Router) {}


  ngOnInit() {
    this.isActivated = false;
    this.route.params.subscribe(params => {
      var id = params['id'];
      this.indexService.verifyPasswordCode(id).subscribe(result => {
        if (result.error) {
          this.router.navigate(['/index']);
        } else {
          this.isActivated = true;
        }
      }, err => {
        if (err.message) {
          this.router.navigate(['/index']);
        }
      })
    });
  }

  changePassword(password, confirmPassword) {
    var isValidPass = true;
    if (password.length < 8) {
      isValidPass = false;
      this.resetPassSymbolErr.nativeElement.style.color = 'rgb(180, 51, 37)';

    } else {
      if (password !== confirmPassword) {
        isValidPass = false;
        this.resetPassConfirmPass.nativeElement.style.display = 'block';
      }
    }

    if (isValidPass) {
      this.resetPassSymbolErr.nativeElement.style.color = '#bbbec2';
      this.resetPassConfirmPass.nativeElement.style.display = 'none';
      this.route.params.subscribe(params => {
        var reset_password_code = params['id'];
        this.indexService.changePasswordByCode(password, confirmPassword, reset_password_code).subscribe(result => {
          if (result.error) {
            this.router.navigate(['/index']);
          } else {
            //TODO show message when password is set normally
            this.router.navigate(['/index']);
          }
        }, err => {
          if (err.message) {
            this.router.navigate(['/index']);
          }
        })
      });
    }
  }
}
