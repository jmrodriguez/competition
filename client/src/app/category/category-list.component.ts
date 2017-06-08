import {Component, OnInit} from '@angular/core';
import {CategoryService} from './category.service';
import {Category} from './category';

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {

  categoryList: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.list().subscribe((categoryList: Category[]) => {
      this.categoryList = categoryList;
    });
  }
}
