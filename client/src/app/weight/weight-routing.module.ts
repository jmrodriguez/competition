import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {WeightListComponent} from './weight-list.component';
import {WeightPersistComponent} from './weight-persist.component';
import {WeightShowComponent} from './weight-show.component';

const routes: Routes = [
  {path: 'weight', redirectTo: 'weight/list', pathMatch: 'full'},
  {path: 'weight/list', component: WeightListComponent},
  {path: 'weight/create', component: WeightPersistComponent},
  {path: 'weight/edit/:id', component: WeightPersistComponent},
  {path: 'weight/show/:id', component: WeightShowComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightRoutingModule {}