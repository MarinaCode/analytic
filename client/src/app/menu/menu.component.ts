import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import { IndexService }   from '../services/index.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService }   from '../services/authentication.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'menu-detail',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss']
  // directives: [LoginComponent]
})
export class MenuComponent implements OnInit{
  @Input() data: string;
  public translatedText: string;
  public supportedLangs: any[];
  public supportedLangsMobile: any[];
  socket = null;
  public backend: boolean = true;
  public homepage: boolean = false;
  public noNotePage: boolean = false;
  public notePage: boolean = false;
  public noMessagePage: boolean = false;
  message:string;
  name: string;
  image:string;
  isLogin: boolean;
  isMasked:boolean;
  id: any;
  @ViewChild('menu_btn_line_1') menu_btn_line_1: ElementRef;
  @ViewChild('menu_btn_line_2') menu_btn_line_2: ElementRef;
  @ViewChild('menu_btn_line_3') menu_btn_line_3: ElementRef;

  constructor (private indexService: IndexService, private authService: AuthenticationService, private _translate: TranslateService, public route : ActivatedRoute, private router: Router) {
    this.indexService.notifierSubjectUserChange.subscribe(userData => {this.changeUserData(userData) });
    this.indexService.notifierSubjectUpdateImage.subscribe(image => {this.changeImage(image) });
    this.socket = io(environment.mainUrl);
    this.socket.on('priceUpdate', function(data){
      this.message = data;
    }.bind(this));
  }

  check(url) {
    this.isMasked = true;
    this.indexService.notifyCheckUrl(url);
    this.isMasked = false;
    var menu_btn_line_2_display = this.menu_btn_line_2.nativeElement.style.getPropertyValue('display');
    var drop_parent = document.getElementById('parent-of-drop-down');
    this.menu_btn_line_2.nativeElement.style.display = 'block';
    menu_btn_line_2_display = 'block';
    this.menu_btn_line_1.nativeElement.style.transform = 'rotateZ(0deg)';
    this.menu_btn_line_1.nativeElement.style.transformOrigin = '0 0 0';
    this.menu_btn_line_1.nativeElement.style.width = '24px';
    this.menu_btn_line_3.nativeElement.style.transform = 'rotateZ(0deg)';
    this.menu_btn_line_3.nativeElement.style.transformOrigin = '1px 4px 0';
    this.menu_btn_line_3.nativeElement.style.width = '24px';
    drop_parent.style.transform = 'translateY(100vh)';
    document.getElementById('body').style.overflowY = 'auto';

  }
  changeImage(image: any) {
    this.image = image;
  }

  changeUserData(userData: any) {
    if (userData) {
      this.name = userData.first_name;
      if(userData.image === "") {
        document.getElementsByClassName('userPicDefault')[0].setAttribute('style','display: inline;');
      } else {
          this.image = userData.image;
      }
      this.isLogin = true;
      this.homepage = false;
      this.backend = true;
    } else {
      this.isLogin = false;
      this.backend = false;
      this.homepage = true;
    }
  }

  ngOnInit(): void {
    var snapshot = this.route.snapshot;
    if (snapshot.routeConfig) {
      if (snapshot.routeConfig.path == 'index' || snapshot.routeConfig.path == "") {
        this.homepage = true;
        this.backend = false;
      }
    }
    if (this.isLogin) {
      this.homepage = false;
      this.backend = true;
    } else {
      this.backend = false;
      this.homepage = true;
    }

    // standing data
    this.supportedLangs = [
      { display: 'English', value: 'en' },
      { display: 'Русский', value: 'ru' },
      { display: 'Italiano', value: 'it' },
    ];
    this.supportedLangsMobile = [
      { display: 'Eng', value: 'en' },
      { display: 'Ру', value: 'ru' },
      { display: 'It', value: 'it' },
    ];
  }
  hideNotePage($event) {
    this.noNotePage = false;
    this.notePage = false;
    this.noMessagePage = false;
  }
  showNotePage($event) {
    this.noNotePage = true;
  }

  showMessagePage($event) {
    this.noMessagePage = true;
  }
  tryDemo() {
    this.indexService.createDemoUser().subscribe(result => {
      localStorage.setItem('currentUser', JSON.stringify(result));
      this.indexService.notifyUserChange(result);
      this.router.navigate(['/dashboard']);
    }, err=> {

    });
  }

  isCurrentLang(lang: string) {
    return lang === this._translate.currentLang;
  }

  selectLang(lang: string) {
    // set default;
    this._translate.use(lang);
    this.refreshText();
  }

  refreshText() {
    this.translatedText = this._translate.instant('hello world');
  }

  public change(event) {
    var node = event.currentTarget;
    var parent = node.parentNode;
    var prev = parent.firstChild;
    if(prev == node) return false;
    var oldChild = parent.removeChild(node);
    parent.insertBefore(oldChild,prev);
  }

  drop($event) {
    var menu_btn_line_2_display = this.menu_btn_line_2.nativeElement.style.getPropertyValue('display');
    var drop_parent = document.getElementById('parent-of-drop-down');
    if( menu_btn_line_2_display == 'none') {
      drop_parent.classList.remove('menu-animation-down');
      drop_parent.classList.add('menu-animation-up')
      setTimeout(()=>{
        drop_parent.style.transform = 'translateY(-100vh)';
        drop_parent.classList.remove('menu-animation-up');
      },900);
      this.menu_btn_line_2.nativeElement.style.display = 'block';
      menu_btn_line_2_display = 'block';
      this.menu_btn_line_1.nativeElement.style.transform = 'rotateZ(0deg)';
      this.menu_btn_line_1.nativeElement.style.transformOrigin = '0 0 0';
      this.menu_btn_line_1.nativeElement.style.width = '24px';
      this.menu_btn_line_3.nativeElement.style.transform = 'rotateZ(0deg)';
      this.menu_btn_line_3.nativeElement.style.transformOrigin = '1px 4px 0';
      this.menu_btn_line_3.nativeElement.style.width = '24px';
      document.getElementById('body').style.overflowY = 'auto';
    } else {
        this.menu_btn_line_2.nativeElement.style.display = 'none';
        menu_btn_line_2_display = 'none';
        this.menu_btn_line_1.nativeElement.setAttribute('style', 'transform: rotateZ(45deg);');
        this.menu_btn_line_1.nativeElement.style.transformOrigin = '0 0 0';
        this.menu_btn_line_1.nativeElement.style.width = '30px';
        this.menu_btn_line_3.nativeElement.setAttribute('style', 'transform: rotateZ(-45deg);');
        this.menu_btn_line_3.nativeElement.style.transformOrigin = '1px 4px 0';
        this.menu_btn_line_3.nativeElement.style.width = '30px';
        drop_parent.classList.remove('menu-animation-up');
        drop_parent.classList.add('menu-animation-down');
        setTimeout(()=>{
          drop_parent.style.transform = 'translateY(0px)';
          setTimeout(()=>{
            drop_parent.classList.remove('menu-animation-down');
          },1000)
        },900);
        document.getElementById('body').style.overflowY = 'hidden';
    }

  }

  dropLogout($event) {
    var menu_btn_line_2_display = this.menu_btn_line_2.nativeElement.style.getPropertyValue('display');
    var drop_parentLogout = document.getElementById('parent-of-drop-down-logout');
    if( menu_btn_line_2_display == 'none') {
      drop_parentLogout.classList.remove('menu-logout-animation-down');
      drop_parentLogout.classList.add('menu-logout-animation-up')
      setTimeout(()=>{
        drop_parentLogout.style.transform = 'translateY(-100vh)';
        drop_parentLogout.classList.remove('menu-logout-animation-up');
      },700);
      this.menu_btn_line_2.nativeElement.style.display = 'block';
      menu_btn_line_2_display = 'block';
      this.menu_btn_line_1.nativeElement.style.transform = 'rotateZ(0deg)';
      this.menu_btn_line_1.nativeElement.style.transformOrigin = '0 0 0';
      this.menu_btn_line_1.nativeElement.style.width = '24px';
      this.menu_btn_line_3.nativeElement.style.transform = 'rotateZ(0deg)';
      this.menu_btn_line_3.nativeElement.style.transformOrigin = '1px 4px 0';
      this.menu_btn_line_3.nativeElement.style.width = '24px';
    } else {
      this.menu_btn_line_2.nativeElement.style.display = 'none';
      menu_btn_line_2_display = 'none';
      this.menu_btn_line_1.nativeElement.setAttribute('style', 'transform: rotateZ(45deg);');
      this.menu_btn_line_1.nativeElement.style.transformOrigin = '0 0 0';
      this.menu_btn_line_1.nativeElement.style.width = '30px';
      this.menu_btn_line_3.nativeElement.setAttribute('style', 'transform: rotateZ(-45deg);');
      this.menu_btn_line_3.nativeElement.style.transformOrigin = '1px 4px 0';
      this.menu_btn_line_3.nativeElement.style.width = '30px';
      drop_parentLogout.style.transform = 'translateY(0px)';
      drop_parentLogout.classList.remove('menu-logout-animation-up');
      drop_parentLogout.classList.add('menu-logout-animation-down');
      setTimeout(()=>{
        drop_parentLogout.style.transform = 'translateY(0px)';
        setTimeout(()=>{
          drop_parentLogout.classList.remove('menu-logout-animation-down');
        },800)
      },700);
    }

  }
  hideMenuLogin($event) {
    var menu_btn_line_2_display = this.menu_btn_line_2.nativeElement.style.getPropertyValue('display');
    var drop_parent = document.getElementById('parent-of-drop-down');
    drop_parent.classList.remove('menu-animation-down');
    drop_parent.classList.add('menu-animation-up')
    setTimeout(()=>{
      drop_parent.style.transform = 'translateY(-100vh)';
      drop_parent.classList.remove('menu-animation-up');
    },900);
    this.menu_btn_line_2.nativeElement.style.display = 'block';
    menu_btn_line_2_display = 'block';
    this.menu_btn_line_1.nativeElement.style.transform = 'rotateZ(0deg)';
    this.menu_btn_line_1.nativeElement.style.transformOrigin = '0 0 0';
    this.menu_btn_line_1.nativeElement.style.width = '24px';
    this.menu_btn_line_3.nativeElement.style.transform = 'rotateZ(0deg)';
    this.menu_btn_line_3.nativeElement.style.transformOrigin = '1px 4px 0';
    this.menu_btn_line_3.nativeElement.style.width = '24px';
    document.getElementById('body').style.overflowY = 'auto';
  }
  hideMenu($event) {
    var menu_btn_line_2_display = this.menu_btn_line_2.nativeElement.style.getPropertyValue('display');
    var drop_parentLogout = document.getElementById('parent-of-drop-down-logout');
    drop_parentLogout.classList.remove('menu-logout-animation-down');
    drop_parentLogout.classList.add('menu-logout-animation-up')
    setTimeout(()=>{
      drop_parentLogout.style.transform = 'translateY(-100vh)';
      drop_parentLogout.classList.remove('menu-logout-animation-up');
    },700);
    this.menu_btn_line_2.nativeElement.style.display = 'block';
    menu_btn_line_2_display = 'block';
    this.menu_btn_line_1.nativeElement.style.transform = 'rotateZ(0deg)';
    this.menu_btn_line_1.nativeElement.style.transformOrigin = '0 0 0';
    this.menu_btn_line_1.nativeElement.style.width = '24px';
    this.menu_btn_line_3.nativeElement.style.transform = 'rotateZ(0deg)';
    this.menu_btn_line_3.nativeElement.style.transformOrigin = '1px 4px 0';
    this.menu_btn_line_3.nativeElement.style.width = '24px';
    document.getElementById('body').style.overflowY = 'auto';
  }
}
