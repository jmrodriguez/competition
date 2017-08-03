import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {CategoryService} from './category.service';


import {CategoryRoutingModule} from './category-routing.module';
import {CategoryShowComponent} from './category-show.component';
import {CategoryListComponent} from './category-list.component';
import {CategoryPersistComponent} from './category-persist.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryPersistComponent,
    CategoryShowComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    CategoryRoutingModule
  ],
  providers: [
    CategoryService
  ]
})
export class CategoryModule {}