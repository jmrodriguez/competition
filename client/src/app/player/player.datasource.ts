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

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class PlayerDataSource extends DataSource<any> {

    total: Observable<number>;

    tournament: Tournament;
    search: string = null;
    playerType: number = 0;
    gamePlanAvailable:boolean = false;

    constructor(private tournamentStream: Subject<Tournament>,
                private searchTermStream: Subject<string>,
                private playerTypeStream: Subject<number>,
                private paginator: MdPaginator,
                private sort: MdSort,
                private playerService: PlayerService) {
        super();
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
            .merge(searchSource)
            .merge(playerTypeSource)
            .mergeMap((params: any) => {
                return this.playerService.list(this.tournament, this.search, this.paginator.pageIndex + 1, null, this.playerType, this.tournament.category, this.paginator.pageSize, this.sort.active, this.sort.direction, false);
            }).share();

        this.total = source.pluck('total');

        this.total.subscribe(total => {
            this.gamePlanAvailable = this.playerType == 0 && total > 8
        })
        return source.pluck('list');
    }

    disconnect() {}
}