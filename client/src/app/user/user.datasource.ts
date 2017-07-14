/**
 * Created by jmrodriguez on 7/13/17.
 */

import {DataSource} from "@angular/cdk";
import {MdPaginator, MdSort} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {EventEmitter} from "@angular/core";
import {UserService} from "./user.service";
import {User} from "./user";

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class UserDataSource extends DataSource<any> {

    total: Observable<number>;

    search: string = null;
    init: boolean = false;

    connectionNotifier: EventEmitter<boolean>;

    constructor(private searchTermStream: Subject<string>,
                private paginator: MdPaginator,
                private sort: MdSort,
                private userService: UserService,
                private initStream: Subject<boolean>) {
        super();
        this.connectionNotifier = new EventEmitter();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<User[]> {
        const displayDataChanges = [
            this.paginator.page,
            this.sort.mdSortChange
        ];

        const searchSource = this.searchTermStream
            .debounceTime(1000)
            .distinctUntilChanged()
            .map(searchTerm => {
                this.search = searchTerm;
                return {search: searchTerm}
            });

        const initSource = this.initStream.map(init => {
            this.init = init;
            return {init: init};
        });

        const source = Observable
            .merge(...displayDataChanges)
            .merge(initSource)
            .merge(searchSource)
            .mergeMap((params: any) => {
                return this.userService.list(this.search, this.paginator.pageIndex + 1, this.paginator.pageSize, this.sort.active, this.sort.direction);
            }).share();

        this.total = source.pluck('total');
        this.connectionNotifier.emit(true);
        return source.pluck('list');
    }

    disconnect() {
        this.connectionNotifier.emit(false);
    }
}