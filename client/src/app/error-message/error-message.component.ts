import { Component,OnInit } from '@angular/core';
@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css'],
})
export class ErrorMessageComponent implements OnInit
{
  private ErrorMsg: string;
  public ErrorMessageIsVisible: boolean;
  isMasked: boolean;

  showErrorMessage(msg: string)
  {
    this.ErrorMsg = msg;
    this.ErrorMessageIsVisible = true;
  }

  hideErrorMsg() {
    this.ErrorMessageIsVisible = false;
  }


  ngOnInit(): void {
    this.isMasked = false;
  }
}
