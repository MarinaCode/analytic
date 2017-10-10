import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PageAnalysisComponent } from './page-analysis/page-analysis.component';
import { AccountComponent } from './account/account.component';
import { HelpComponent } from './help/help.component';
import { ContactComponent } from './contact/contact.component';
import { TermsOfServicesComponent } from './terms-of-services/terms-of-services.component';
import { PolicyComponent } from './policy/policy.component';
import { SiteVsSiteComponent } from './site-vs-site/site-vs-site.component';
import { CheckerComponent } from './checker/checker.component';
import { ActivationComponent } from './activation/activation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PricingComponent } from './pricing/pricing.component';
import { AboutUsComponent } from './about-us/about-us.component';
import {BlogComponent } from './blog/blog.component';

import { AuthGuard } from './_guard/auth-guard';
//import { RegistrationComponent } from './registration/registration.component';
import { SitesListComponent } from './sites-list/sites-list.component';

const appRoutes: Routes  = [
  { path: '', redirectTo: '/index', pathMatch: 'full'},
  { path: 'index', component: IndexComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'page-analysis', component: SitesListComponent, canActivate: [AuthGuard] },
  { path: 'page-analysis/:id', component: PageAnalysisComponent, canActivate: [AuthGuard] },
  { path: 'site-vs-site', component: SiteVsSiteComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'activation/:id', component: ActivationComponent},
  { path: 'reset-password/:id', component: ResetPasswordComponent},
  { path: 'checker', component: CheckerComponent, canActivate: [AuthGuard] },
  { path: 'pricing', component: PricingComponent},
  { path: 'blog', component: BlogComponent},
  { path: 'aboutus', component: AboutUsComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'terms', component: TermsOfServicesComponent},
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: 'policy', component: PolicyComponent},
  { path: '**',  component: NotFoundComponent}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
