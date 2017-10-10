import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
import {IndexService }   from '../services/index.service';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() limit: number;
  @Input() sitesCount: number;
  page: number = 1;
  currentIndex = 1;
  @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('list_next') list_next: ElementRef;
  @ViewChild('list_previous') list_previous: ElementRef;
  index: number = 0;
  pageCounts: number;
  currentPage: number;
  constructor(private indexService: IndexService) {
    this.indexService.notifierSubjectPagination.subscribe(() => {this.onSuccessPagination() });
  }

  ngOnChanges() {
    this.updatePageCount();
  }

  ngOnInit() {
    this.updatePageCount();
  }

  updatePageCount() {
    this.pageCounts = this.sitesCount;
    this.currentPage = (this.index + this.limit) >= this.sitesCount ? this.sitesCount : this.index + this.limit ;
  }

  onSuccessPagination() {
    this.updatePageCount();
    this.page = this.index == 0 ? 1 : (this.index >= this.limit ? ( Math.ceil(this.index/this.limit)+ 1) : this.index);
  }

  onKeyPress(event) {
    if (event.charCode === 13)  {
      event.preventDefault();
      var value = parseInt(event.target.value);
      var pageCounts = Math.ceil(this.sitesCount/this.limit);
      this.index = value <= 0 ? 0 : (value >= pageCounts ? (pageCounts-1)*this.limit : (value - 1) * this.limit);
      this.currentIndex =  value <= 0 ? 0 : (value >= pageCounts ? pageCounts : value);
      this.pageChange.emit({index: this.index, limit: this.limit});
    }
  }

  onNavigate(isNext) {
    if (isNext) {
      if (this.currentIndex < Math.ceil(this.sitesCount/this.limit)) {
        this.index += this.limit;
        this.currentIndex++;
        this.list_previous.nativeElement.classList.remove('disable');
        if (this.currentIndex >= Math.ceil(this.sitesCount/this.limit)) {
          this.list_next.nativeElement.classList.add('disable');
        }
      } else {
        return;
      }
    } else {
      if (this.index != 0) {
        this.index -= this.limit;
        this.currentIndex--;
        this.list_next.nativeElement.classList.remove('disable');
        if (this.index == 0) {
          this.list_previous.nativeElement.classList.add('disable');
        }
      } else {
        return;
      }
    }
    this.pageChange.emit({index: this.index, limit: this.limit});
  }
}
