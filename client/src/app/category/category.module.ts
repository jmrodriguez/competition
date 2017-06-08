import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {CategoryService} from './category.service';


import {CategoryRoutingModule} from './category-routing.module';
import {CategoryShowComponent} from './category-show.component';
import {CategoryListComponent} from './category-list.component';
import {CategoryPersistComponent} from './category-persist.component';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryPersistComponent,
    CategoryShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CategoryRoutingModule
  ],
  providers: [
    CategoryService
  ]
})
export class CategoryModule {}