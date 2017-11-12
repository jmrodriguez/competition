import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PointsRangeService} from './pointsRange.service';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute} from "@angular/router";
import {MatPaginator, MatSort} from "@angular/material";
import {PointsRangeDataSource} from "./pointsRange.datasource";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'pointsRange-list',
  templateUrl: './pointsRange-list.component.html'
})
export class PointsRangeListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'min', 'max', 'federation'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() terms = "";

  pointsRangeDatasource: PointsRangeDataSource | null;

  private searchTermStream = new Subject<string>();
  private initStream = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              private pointsRangeService: PointsRangeService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.pointsRangeDatasource = new PointsRangeDataSource(this.searchTermStream, this.paginator, this.sort, this.pointsRangeService, this.initStream);
    // listen to datasource connection to trigger initial search
    this.pointsRangeDatasource.connectionNotifier.subscribe((connected: boolean) => {
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
