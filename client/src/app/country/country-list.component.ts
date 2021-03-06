import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CountryService} from './country.service';
import {MatPaginator, MatSort} from "@angular/material";
import {CountryDataSource} from "./country.datasource";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'country-list',
  templateUrl: './country-list.component.html'
})
export class CountryListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'isoCode'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() terms = "";

  countryDatasource: CountryDataSource | null;

  private searchTermStream = new Subject<string>();
  private initStream = new Subject<boolean>();

  constructor(private countryService: CountryService) { }

  ngOnInit() {
    this.countryDatasource = new CountryDataSource(this.searchTermStream, this.paginator, this.sort, this.countryService, this.initStream);
    // listen to datasource connection to trigger initial search
    this.countryDatasource.connectionNotifier.subscribe((connected: boolean) => {
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
