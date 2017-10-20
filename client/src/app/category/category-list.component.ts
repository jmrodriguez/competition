import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from './category.service';
import {MatPaginator, MatSort} from "@angular/material";
import {CategoryDataSource} from "./category.datasource";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'minAge', 'maxAge', 'youthCategory'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() terms = "";

  categoryDatasource: CategoryDataSource | null;

  private searchTermStream = new Subject<string>();
  private initStream = new Subject<boolean>();

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryDatasource = new CategoryDataSource(this.searchTermStream, this.paginator, this.sort, this.categoryService, this.initStream);
    // listen to datasource connection to trigger initial search
    this.categoryDatasource.connectionNotifier.subscribe((connected: boolean) => {
      if (connected) {
        // TRIGGER THE INITIAL SEARCH. We could use any subject for this purpose
        // XXX: not sure why but if we don't use a timeout here, even with time 0, the event is not triggered
        setTimeout (() => {
          this.initStream.next(true);
        }, 0);
      }
    });
  }

  search(value:string) {
    this.terms = value;
    this.searchTermStream.next(this.terms);
  }

  clearFilterText() {
    this.terms = "";
    this.search(this.terms);
  }
}
