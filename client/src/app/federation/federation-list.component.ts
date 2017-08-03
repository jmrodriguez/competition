import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FederationService} from './federation.service';
import {MdPaginator, MdSort} from "@angular/material";
import {FederationDataSource} from "./federation.datasource";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'federation-list',
  templateUrl: './federation-list.component.html'
})
export class FederationListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'logo', 'description', 'country'];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;

  @Input() terms = "";

  federationDatasource: FederationDataSource | null;

  private searchTermStream = new Subject<string>();
  private initStream = new Subject<boolean>();

  constructor(private federationService: FederationService) { }

  ngOnInit() {
    this.federationDatasource = new FederationDataSource(this.searchTermStream, this.paginator, this.sort, this.federationService, this.initStream);
    // listen to datasource connection to trigger initial search
    this.federationDatasource.connectionNotifier.subscribe((connected: boolean) => {
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
