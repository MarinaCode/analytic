import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements OnInit {
  @Input() siteData : any;
  doc: any;
  perfect: number;
  good:  number;
  bad: number;
  emailsClass: number;
  tables: any;
  commentLength: number;
  emails: any;
  designScore:any = {
    protectClass : 0,
    swfClass : 0,
    frameClass : 0,
    contetntSecureClass : 0,
    commentClass : 0,
    doctypeClass : 0,
    charsetClass : 0,
    tableClass : 0,
    headerInfo : null,
    tables: [],
    getFrames: [],
    swfs: [],
    comments: []
  };
  url: string;
  mainUrl: string;

  constructor(private indexService: IndexService, private route: ActivatedRoute) {  }

  ngOnInit() {
  }
}
