/**
 * Created by jmrodriguez on 7/13/17.
 */

import {DataSource} from "@angular/cdk";
import {MdPaginator, MdSort} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {Player} from "./player";
import {Tournament} from "../tournament/tournament";
import {PlayerService} from "./player.service";
import {Subject} from "rxjs/Subject";
import {Federation} from "../federation/federation";
import {EventEmitter} from "@angular/core";

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class PlayerDataSource extends DataSource<any> {

    total: Observable<number>;

    tournament: Tournament;
    federation: Federation;
    search: string = null;
    playerType: number = 0;
    gamePlanAvailable:boolean = false;

    connectionNotifier: EventEmitter<boolean>;

    constructor(private tournamentStream: Subject<Tournament>,
                private federationStream: Subject<Federation>,
                private searchTermStream: Subject<string>,
                private playerTypeStream: Subject<number>,
                private paginator: MdPaginator,
                private sort: MdSort,
                private playerService: PlayerService) {
        super();
        this.connectionNotifier = new EventEmitter();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Player[]> {
        const displayDataChanges = [
            this.paginator.page,
            this.sort.mdSortChange
        ];

        const tournamentSource = this.tournamentStream.map(tournament => {
            this.tournament = tournament;
            return {tournament: tournament};
        });

        const federationSource = this.federationStream.map(federation => {
            this.federation = federation;
            return {federation: federation};
        });

        const searchSource = this.searchTermStream
            .debounceTime(1000)
            .distinctUntilChanged()
            .map(searchTerm => {
                this.search = searchTerm;
                return {search: searchTerm}
            });

        const playerTypeSource = this.playerTypeStream.map(playerType => {
            this.playerType = playerType;
            return {playerType: playerType};
        });

        const source = Observable
            .merge(...displayDataChanges)
            .merge(tournamentSource)
            .merge(federationSource)
            .merge(searchSource)
            .merge(playerTypeSource)
            .mergeMap((params: any) => {
                let category = this.tournament ? this.tournament.category : null;
                return this.playerService.list(this.tournament, this.search, this.paginator.pageIndex + 1, this.federation, this.playerType, category, this.paginator.pageSize, this.sort.active, this.sort.direction, false);
            }).share();

        this.total = source.pluck('total');

        this.total.subscribe(total => {
            this.gamePlanAvailable = this.playerType == 0 && total > 8
        });

        this.connectionNotifier.emit(true);
        return source.pluck('list');
    }

    disconnect() {
        this.connectionNotifier.emit(false);
    }
}