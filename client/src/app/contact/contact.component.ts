import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormGroup,FormControl, FormBuilder,Validators} from '@angular/forms';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService }   from '../services/authentication.service';
import { Utils } from '../utils/utils';
import {Loading} from "../loading/loading.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  formContact: FormGroup;
  @ViewChild('saveBtn') saveBtn: ElementRef;
  @ViewChild('username') username: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('message') message: ElementRef;

  constructor(private indexService: IndexService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private authService: AuthenticationService) {}

  public contactUsLogin: boolean = false;
  public contactUsLogout: boolean = true;

  ngOnInit(): void {
    this.formContact = this.fb.group({
      username : new FormControl('', [Validators.required, Validators.maxLength(10)]),
      email :   new FormControl('', [Validators.required, this.emailValidator]),
      subject:  new FormControl('', [Validators.required, Validators.maxLength(10)]),
      message:  new FormControl('', [Validators.required, Validators.maxLength(100)])
    });
    if(this.authService.loggedIn()) {
      this.contactUsLogin = true;
      this.contactUsLogout = false;
    }
    else {
      this.contactUsLogin = false;
      this.contactUsLogout = true;
    }
  }

  contactForm(formData: any, event: any) {
    this.username.nativeElement.style.border = 'none';
    this.email.nativeElement.style.border = 'none';
    this.subject.nativeElement.style.border = 'none';
    this.message.nativeElement.style.border = 'none';
    event.preventDefault();
    if (this.formContact.valid) {
      this.indexService.contactUs(formData.email, formData.username, formData.subject, formData.message).subscribe(formData => {
          if (formData.data) {
            //TODO show message if mail is sent
            this.saveBtn.nativeElement.innerText = "Submitted";
            setTimeout(()=> {
              this.saveBtn.nativeElement.innerText = "Submit";
            }, 3000)
          }
        },
        err => {
          if (err) {
            var message = err.json().error;
            if (message) {
              //TODO
              if (message == "Username is not correct") {
                this.username.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
              } else if (message == "Email is not correct") {
                this.email.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
              } else if (message == "Subject is not correct") {
                this.subject.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
              } else if (message == "Message is required") {
                this.message.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
              }
            }
          }
        });
    } else if(formData.username.trim().length == 0 || formData.username.trim().length > 10){
      this.username.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
    } else if(!Utils.regEmail(formData.email)) {
      this.email.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
    } else if(formData.subject.trim().length == 0 || formData.subject.trim().length > 10) {
      this.subject.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
    } else if(formData.message.trim().length == 0 || formData.message.trim().length > 101) {
      this.message.nativeElement.style.border = '2px solid rgb(180, 51, 37)';
    }
  }

  emailValidator(control: any) {
    var emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (control.value && !emailRegexp.test(control.value)) {
      return {invalidEmail: true};
    }
  }
}
