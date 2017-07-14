import {Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {UserService} from './user.service';
import {Subject} from "rxjs/Subject";
import {ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/pluck';
import {MdPaginator, MdSort} from "@angular/material";
import {UserDataSource} from "./user.datasource";

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'lastLoginDate', 'accountLocked', 'accountExpired'];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;

  userDatasource: UserDataSource | null;

  private searchTermStream = new Subject<string>();
  private initStream = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userDatasource = new UserDataSource(this.searchTermStream, this.paginator, this.sort, this.userService, this.initStream);
    // listen to datasource connection to trigger initial search
    this.userDatasource.connectionNotifier.subscribe((connected: boolean) => {
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
