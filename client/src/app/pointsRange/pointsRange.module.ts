import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import { TranslateModule } from '@ngx-translate/core';
import {PointsRangeService} from './pointsRange.service';

import {PointsRangeRoutingModule} from './pointsRange-routing.module';
import {PointsRangeShowComponent} from './pointsRange-show.component';
import {PointsRangeListComponent} from './pointsRange-list.component';
import {PointsRangePersistComponent} from './pointsRange-persist.component';
import { WeightModule } from '../weight/weight.module';
import { FederationModule } from '../federation/federation.module';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    PointsRangeListComponent,
    PointsRangePersistComponent,
    PointsRangeShowComponent
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    TranslateModule,
    PointsRangeRoutingModule,
    FederationModule
  ],
  providers: [
    PointsRangeService
  ]
})
export class PointsRangeModule {}