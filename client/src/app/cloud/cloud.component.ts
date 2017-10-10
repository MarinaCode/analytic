import { Component, OnInit, Input } from '@angular/core';
declare var WordCloud: any;
@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.css']
})

export class CloudComponent implements OnInit {
  @Input() cloudData : any;
  constructor() { }
  ngOnInit() {
    WordCloud(document.getElementById("my_canvas"), {
      list: this.cloudData,
      gridSize: 1,
      minSize: 0,
      // backgroundColor: '#333300',
      // color: function (word, weight) { return '#000000' }
    });

  }

  ngAfterViewInit() {

  }

}
