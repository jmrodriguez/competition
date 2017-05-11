import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {IndexComponent} from "./index/index.component";
import { CanDeactivateGuard } from './guard/can-deactivate-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent},
  // otherwise redirect to home
  { path: '**', redirectTo: 'index' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    CanDeactivateGuard
  ]
})
export class AppRoutingModule {}