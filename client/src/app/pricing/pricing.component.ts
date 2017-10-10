import { Component } from '@angular/core';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
  selector: 'pricing',
  templateUrl: 'pricing.component.html',
  styleUrls: ['pricing.component.scss']
})

export class PricingComponent {

  constructor(private _translate: TranslateService) {}
  price ='$29 ';

  ngOnInit(): void {  }

  isCurrentLang(lang: string) {
    return lang === this._translate.currentLang;
  }

  selectLang(lang: string) {
    this._translate.use(lang);
  }
}
