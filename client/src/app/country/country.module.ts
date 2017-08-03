import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {CountryService} from './country.service';


import {CountryRoutingModule} from './country-routing.module';
import {CountryShowComponent} from './country-show.component';
import {CountryListComponent} from './country-list.component';
import {CountryPersistComponent} from './country-persist.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    CountryListComponent,
    CountryPersistComponent,
    CountryShowComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    CountryRoutingModule
  ],
  providers: [
    CountryService
  ]
})
export class CountryModule {}