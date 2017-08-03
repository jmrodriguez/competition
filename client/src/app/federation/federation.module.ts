import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {FederationService} from './federation.service';


import {FederationRoutingModule} from './federation-routing.module';
import {FederationShowComponent} from './federation-show.component';
import {FederationListComponent} from './federation-list.component';
import {FederationPersistComponent} from './federation-persist.component';
import { FederationLogoModule } from '../federationLogo/federationLogo.module';
import { CountryModule } from '../country/country.module';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    FederationListComponent,
    FederationPersistComponent,
    FederationShowComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    FederationRoutingModule,
    FederationLogoModule,
    CountryModule
],
  providers: [
    FederationService
  ]
})
export class FederationModule {}