/**
 * Created by jmrodriguez on 6/2/17.
 */

import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Response} from '@angular/http';
import {Tournament} from "../tournament/tournament";
import {TournamentService} from "../tournament/tournament.service";
import {Observable} from "rxjs/Observable";
import {AuthService} from '../services/auth.service';

declare var $: any;

@Directive({
    selector: '[finalBracket]'
})

export class BracketDirective {

    @Input() initData:Observable<any>;
    @Input() tournament:Tournament;
    @Output() notifyBracketError: EventEmitter<any> = new EventEmitter<any>();
    @Output() notifyBracketChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(private el: ElementRef,
                private authService: AuthService,
                private tournamentService: TournamentService) {
    }

    ngAfterViewInit() {
        //this.el.nativeElement.style.backgroundColor = 'yellow';

        this.initData.subscribe((initData: any) => {
            // USE userData as a way to pass "this" to the jquery plugin, so that we can call a service to perform
            // operations to store the bracket information
            if (initData == null) {
                $(this.el.nativeElement).empty();
            } else {
                if (this.authService.isAuthenticated()) {
                    $(this.el.nativeElement).bracket({
                        init: initData,
                        skipConsolationRound: true,
                        centerConnectors: true,
                        disableToolbar: true,
                        disableTeamEdit: true,
                        userData: this,
                        save: this.saveFn, /* without save() labels are disabled */
                        decorator: {edit: this.edit_fn,
                            render: this.render_fn},
                        teamWidth: 300
                    });
                } else {
                    $(this.el.nativeElement).bracket({
                        init: initData,
                        skipConsolationRound: true,
                        centerConnectors: true,
                        userData: this,
                        decorator: {edit: this.edit_fn,
                            render: this.render_fn},
                        teamWidth: 300
                    });
                }

            }
        });
    }

    /**
     * Called whenever bracket is modified
     *
     * data:     changed bracket object in format given to init
     * userData: optional data given when bracket is created.
     */
    saveFn(data, userData) {
        let bracketInfo = JSON.stringify(data);
        userData.tournament.bracketInfo = bracketInfo;
        userData.tournamentService.save(userData.tournament).subscribe((tournament: Tournament) => {
            userData.tournament = tournament;
            userData.notifyBracketChange.next(bracketInfo);
        }, (err: Response) => {
            console.log("There was an error updating final bracket information");
            userData.notifyBracketError.next(err);
        });
    }

    /* Edit function is called when team label is clicked (not in use due to disableTeamEdit flag set to true) */
    edit_fn(container, data, doneCb) {
        let input = $('<input type="text">');
        input.val(data ? data.flag + ':' + data.name : '');
        container.html(input);
        input.focus();
        input.blur(function() {
            let inputValue = input.val();
            if (inputValue.length === 0) {
                doneCb(null); // Drop the team and replace with BYE
            } else {
                let flagAndName = inputValue.split(':'); // Expects correct input
                doneCb({flag: flagAndName[0], name: flagAndName[1]});
            }
        });
    }

    render_fn(container, data, score, state) {
        switch(state) {
            case "empty-bye":
                container.append("BYE");
                return;
            case "empty-tbd":
                container.append("Upcoming");
                return;

            case "entry-no-score":
            case "entry-default-win":
            case "entry-complete":
                let htmlString =
                    "<span class='flag-icon flag-icon-" + data.flag + " flagContainer'></span> " +
                    "<div class='infoContainer'>" +
                        "<span class='nameContainer'>" + "(" + data.id + ") " + data.name + "</span> " +
                        "<span class='clubContainer'>" + data.club + "</span> " +
                    "</div>";
                container.append(htmlString);
                return;
        }
    }

    /**
     * Counts the number of matches with results in the bracket
     */
    countMatches(node) {
        let count = 0;
        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                if (!Array.isArray(node[i])) {
                    return 1;
                } else {
                    count += this.countMatches(node[i]);
                }
            }
        }
        return count;
    }
}
