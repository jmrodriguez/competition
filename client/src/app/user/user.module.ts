import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
    TranslateModule,
    UserRoutingModule
  ],
  providers: [
    UserService
  ]
})
export class UserModule {}