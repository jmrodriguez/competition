import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GroupService} from "./group.service";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
      GroupService
  ]
})
export class GroupModule {}