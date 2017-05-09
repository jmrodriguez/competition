import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {CountryListComponent} from './country-list.component';
import {CountryPersistComponent} from './country-persist.component';
import {CountryShowComponent} from './country-show.component';

const routes: Routes = [
  {path: 'country', redirectTo: 'country/list', pathMatch: 'full'},
  {path: 'country/list', component: CountryListComponent},
  {path: 'country/create', component: CountryPersistComponent},
  {path: 'country/edit/:id', component: CountryPersistComponent},
  {path: 'country/show/:id', component: CountryShowComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule {}