import {Component, OnInit, ViewChild} from '@angular/core';
import {WeightService} from './weight.service';
import {Weight} from './weight';
import {MdPaginator, MdSort} from "@angular/material";
import {WeightDataSource} from "../weight/weight.datasource";
import {Subject} from "rxjs/Subject";
import {ListResult} from "app/helpers/list-result.interface";

@Component({
  selector: 'weight-list',
  templateUrl: './weight-list.component.html'
})
export class WeightListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'factor'];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;

  weightDatasource: WeightDataSource | null;

  private searchTermStream = new Subject<string>();
  private initStream = new Subject<boolean>();

  constructor(private weightService: WeightService) { }

  ngOnInit() {
    this.weightDatasource = new WeightDataSource(this.searchTermStream, this.paginator, this.sort, this.weightService, this.initStream);
    // listen to datasource connection to trigger initial search
    this.weightDatasource.connectionNotifier.subscribe((connected: boolean) => {
      if (connected) {
        // TRIGGER THE INITIAL SEARCH. We could use any subject for this purpose
        // XXX: not sure why but if we don't use a timeout here, even with time 0, the event is not triggered
        setTimeout (() => {
          this.initStream.next(true);
        }, 0);
      }
    });
  }

  search(terms: string) {
    this.searchTermStream.next(terms)
  }
}
