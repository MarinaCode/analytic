import { Component, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { Utils } from '../utils/utils';
import {utils} from "protractor/built/index";
var s = require("underscore.string");

@Component({
  selector: 'app-checker',
  templateUrl: './checker.component.html',
  styleUrls: ['./checker.component.scss'],
})
export class CheckerComponent implements OnInit {
 // private str = "";
  links:[string];
  plagiatData:any = [];
  allTexts:any = [];
  plagiatAllPercent:any = 0;
  @ViewChild('textArea') textArea: ElementRef;
  @ViewChild(ErrorMessageComponent) errorMsg: ErrorMessageComponent;
  @ViewChild('editText') editText: ElementRef;
  @ViewChild('analyzing') analyzing: ElementRef;
  @ViewChild('searching') searching: ElementRef;
  @ViewChild('determine') determine: ElementRef;
  @ViewChild('fillPercent') fillPercent: ElementRef;
  @ViewChild('checkBtn') checkBtn: any;
  @ViewChild('checkingBlock') checkingBlock: ElementRef;
  @ViewChild('textInfo') textInfo: ElementRef;
  @ViewChild('statusBasic') statusBasic: ElementRef;
  @ViewChild('statusStandart') statusStandart: ElementRef;
  @ViewChild('statusPremium') statusPremium: ElementRef;

  @ViewChild('localText') localText: ElementRef;

  constructor(private indexService: IndexService, private router: Router) {}

  ngOnInit() {
    this.plagiatData = [];
    this.allTexts = [];
    this.statusPremium.nativeElement.style.opacity = '0.5';
    this.statusStandart.nativeElement.style.opacity = '0.5';
  }

  calculatePlagiatPercent(text, originalText) {
    var count = 0;
    var plagiatText = [];
    for (var i = 0; i < text.length; i++) {
      if (originalText.indexOf(text[i]) >= 0) {
        plagiatText.push(text[i]);
        this.allTexts.push(text[i]);
        count++
      }
    }
    return {
      percent: parseFloat(Utils.percent(count, originalText.length)),
      plagiatText: plagiatText,
      count: count
    }
  }

  private extractDomain(url) {
  }

  edit(): void {
    this.checkBtn._elementRef.nativeElement.setAttribute("style", "display:display"); //this is specific for this button
    this.textArea.nativeElement.style.display = 'flex';
    this.editText.nativeElement.style.display = 'none';
    this.checkingBlock.nativeElement.style.display = 'none';
  }

  add(): void {
    this.edit();
    this.textArea.nativeElement.value = "";
  }
  private check(value: string): void {
    this.plagiatData = [];
    this.allTexts = [];
    var currentPlagiatData = [];
    this.plagiatAllPercent = "";
    var str = `${value}`;
    var allCount = 0;
    if (str.length <= 10000 && str.length > 10 ) {
       this.analyzing.nativeElement.setAttribute("style", "display:flex");
       this.searching.nativeElement.setAttribute("style", "display:flex");
       this.determine.nativeElement.setAttribute("style", "display:flex");
       this.textArea.nativeElement.style.border = "";
      // this.localText.nativeElement.style.color = "";

       var strText = value.split(" ");
       var str_ = str.replace(/[^a-zA-Z ]/g, "");
       var res = s.words(str_);
       allCount = res.length;
       var uniqueRes = res.filter(function(elem, index, self) {
         return index == self.indexOf(elem);
       })
       var reg = /url\?q=(.+)/g;
       this.analyzing.nativeElement.childNodes[1].classList.add('complete');
       var resUnique = res.filter((elem, index) => {
          return index == res.indexOf(elem);
       });
     } else {
      this.textArea.nativeElement.style.border = "1px  solid #e23737";
      //this.localText.nativeElement.style.color = "#e23737"
    }
  }
}
