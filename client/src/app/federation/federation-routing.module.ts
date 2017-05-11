import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {FederationListComponent} from './federation-list.component';
import {FederationPersistComponent} from './federation-persist.component';
import {FederationShowComponent} from './federation-show.component';
import { AuthGuard }                from '../guard/auth-guard.service';


const routes: Routes = [
  {path: 'federation', redirectTo: 'federation/list', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'federation/list', component: FederationListComponent, canActivate: [AuthGuard]},
  {path: 'federation/create', component: FederationPersistComponent, canActivate: [AuthGuard],},
  {path: 'federation/edit/:id', component: FederationPersistComponent, canActivate: [AuthGuard],},
  {path: 'federation/show/:id', component: FederationShowComponent, canActivate: [AuthGuard],},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FederationRoutingModule {}