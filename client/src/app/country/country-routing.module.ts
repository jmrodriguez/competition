import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {CountryListComponent} from './country-list.component';
import {CountryPersistComponent} from './country-persist.component';
import {CountryShowComponent} from './country-show.component';
import {AuthGuard} from "../guard/auth-guard.service";

const routes: Routes = [
  {path: 'country', redirectTo: 'country/list', pathMatch: 'full', canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'country/list', component: CountryListComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'country/create', component: CountryPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'country/edit/:id', component: CountryPersistComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
  {path: 'country/show/:id', component: CountryShowComponent, canActivate: [AuthGuard], data: { roles: ["ROLE_SUPER_ADMIN"] }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule {}