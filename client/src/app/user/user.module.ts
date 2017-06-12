import {CommonModule} from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PaginationComponent} from "../pagination/pagination.component";
import { TranslateModule } from '@ngx-translate/core';

import {UserService} from './user.service';


import {UserRoutingModule} from './user-routing.module';
import {UserShowComponent} from './user-show.component';
import {UserListComponent} from './user-list.component';
import {UserPersistComponent} from './user-persist.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserPersistComponent,
    UserShowComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    UserRoutingModule
  ],
  providers: [
    UserService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UserModule {}