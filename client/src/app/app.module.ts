import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

// Material 2
import { MdCoreModule } from '@angular2-material/core';
import { MdButtonModule } from '@angular2-material/button';
import { MdButtonToggleModule } from '@angular2-material/button-toggle';
import { MdCardModule } from '@angular2-material/card';
import { MdRadioModule } from '@angular2-material/radio';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { MdTooltipModule } from '@angular2-material/tooltip';
import { MdInputModule } from '@angular2-material/input';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdTabsModule } from '@angular2-material/tabs';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdProgressCircleModule } from '@angular2-material/progress-circle';
import { AppComponent } from './app.component';
import "hammerjs";
import { routing,  appRoutingProviders } from './app.routes';
import {RouterModule} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { IndexService }          from './services/index.service';
import { HttpClient }          from './services/http.client';
import { AuthenticationService }   from './services/authentication.service';
import { AuthGuard } from './_guard/auth-guard';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { PricingComponent } from './pricing/pricing.component';
import { FooterComponent } from './footer/footer.component';

import { MenuComponent } from './menu/menu.component';
import { PageAnalysisComponent } from './page-analysis/page-analysis.component';
import { AccountComponent} from './account/account.component';
import { SiteVsSiteComponent } from './site-vs-site/site-vs-site.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SitesListComponent } from './sites-list/sites-list.component';

import { SeoOverviewComponent } from './seo-overview/seo-overview.component';
import { AnalysisContentComponent } from './analysis-content/analysis-content.component';
import { DesignComponent } from './design/design.component';
import { PerformanceComponent } from './performance/performance.component';
import { CheckerComponent } from './checker/checker.component';
import { Loading } from './loading/loading.component';
//import { RegistrationComponent } from './registration/registration.component';
import { TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import { ChartModule } from 'angular2-highcharts';


import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk/dist';

import { MdUniqueSelectionDispatcher } from '@angular2-material/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { SummaryComponent } from './summary/summary.component';
import { CloudComponent } from './cloud/cloud.component';
import { RemoveSpacesPipe } from './remove-spaces.pipe';
import { ActivationComponent } from './activation/activation.component';
//import { SmallLoadingComponent } from './small-loading/small-loading.component';

import { Http } from '@angular/http';
import { AboutUsComponent } from './about-us/about-us.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ContactComponent } from './contact/contact.component';
import { TermsOfServicesComponent } from './terms-of-services/terms-of-services.component';
import { HelpComponent } from './help/help.component';
import { PolicyComponent } from './policy/policy.component';
import { BlogComponent } from './blog/blog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { ResetPassComponent } from './reset-pass/reset-pass.component'

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/properties', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PaginationComponent,
    DashboardComponent,
    IndexComponent,
    LoginComponent,
    NotFoundComponent,
    ErrorMessageComponent,
    MenuComponent,
    PageAnalysisComponent,
    AccountComponent,
    SiteVsSiteComponent,
    SidenavComponent,
    SitesListComponent,
    SeoOverviewComponent,
    AnalysisContentComponent,
    DesignComponent,
    PerformanceComponent,
    CheckerComponent,
    AccessibilityComponent,
    SummaryComponent,
    CloudComponent,
    RemoveSpacesPipe,
    Loading,
    ActivationComponent,
    PricingComponent,
    FooterComponent,
    AboutUsComponent,
    ContactComponent,
    TermsOfServicesComponent,
    HelpComponent,
    PolicyComponent,
    BlogComponent,
    ResetPasswordComponent
   // SmallLoadingComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    routing,
    MdCoreModule, MdCardModule, MdButtonModule, MdRadioModule,  ChartModule,
    MdCheckboxModule, MdTooltipModule,MdInputModule, MdToolbarModule,MdButtonToggleModule,
    MdTabsModule,MdSidenavModule,MdProgressCircleModule,
    MdRadioModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  providers: [appRoutingProviders, FacebookService, IndexService, AuthenticationService, MdUniqueSelectionDispatcher,
              FormBuilder, Validators, AuthGuard, HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
