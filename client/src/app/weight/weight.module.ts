import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {WeightService} from './weight.service';


import {WeightRoutingModule} from './weight-routing.module';
import {WeightShowComponent} from './weight-show.component';
import {WeightListComponent} from './weight-list.component';
import {WeightPersistComponent} from './weight-persist.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    WeightListComponent,
    WeightPersistComponent,
    WeightShowComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    WeightRoutingModule
  ],
  providers: [
    WeightService
  ]
})
export class WeightModule {}