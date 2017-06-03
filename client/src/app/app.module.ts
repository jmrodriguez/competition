import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IndexComponent } from './index/index.component';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NavService } from './nav/nav.service';
import { AppRoutingModule } from "./app-routing.module";
import { AuthGuard } from './guard/auth-guard.service';
import { LoginModule } from './login/login.module';
import { CountryModule } from './country/country.module';
import { TodoModule } from './todo/todo.module';
import { FederationModule } from './federation/federation.module';
import { BracketDirective } from './directives/bracket.directive';


import { AuthService } from './services/auth.service';

import {HttpFactory} from "./helpers/http.factory";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    IndexComponent,
    BracketDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LoginModule,
    CountryModule,
    TodoModule,
    FederationModule,
    NgbModule.forRoot(),
    AppRoutingModule,

  ],
  providers: [
    AuthService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    NavService,
    AuthGuard,
    {
      provide: Http,
      useFactory: HttpFactory,
      deps: [XHRBackend, RequestOptions]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
