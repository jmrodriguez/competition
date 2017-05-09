import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {CountryService} from './country.service';


import {CountryRoutingModule} from './country-routing.module';
import {CountryShowComponent} from './country-show.component';
import {CountryListComponent} from './country-list.component';
import {CountryPersistComponent} from './country-persist.component';

@NgModule({
  declarations: [
    CountryListComponent,
    CountryPersistComponent,
    CountryShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CountryRoutingModule
  ],
  providers: [
    CountryService
  ]
})
export class CountryModule {}