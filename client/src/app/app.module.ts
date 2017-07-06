import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions} from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { TournamentModule } from './tournament/tournament.module';
import { UserModule } from './user/user.module';

import { AuthService } from './services/auth.service';

import { HttpFactory } from "./helpers/http.factory";
import { WeightModule } from './weight/weight.module';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { TournamentGroupModule } from "./tournamentGroup/tournamentGroup.module";
import { TournamentMatchModule } from "./tournamentMatch/tournamentMatch.module";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    LoginModule,
    CountryModule,
    TodoModule,
    FederationModule,
    TournamentModule,
    UserModule,
    WeightModule,
    CategoryModule,
    PlayerModule,
    TournamentGroupModule,
    TournamentMatchModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    FlashMessagesModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: Http,
      useFactory: HttpFactory,
      deps: [XHRBackend, RequestOptions, Injector]
    },
    AuthService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    NavService,
    AuthGuard,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
