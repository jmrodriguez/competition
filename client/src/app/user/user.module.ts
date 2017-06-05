import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {UserService} from './user.service';


import {UserRoutingModule} from './user-routing.module';
import {UserShowComponent} from './user-show.component';
import {UserListComponent} from './user-list.component';
import {UserPersistComponent} from './user-persist.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserPersistComponent,
    UserShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule
  ],
  providers: [
    UserService
  ]
})
export class UserModule {}