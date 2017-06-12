/**
 * Created by jmrodriguez on 6/2/17.
 */

import {Directive, ElementRef, Input} from '@angular/core';
import {Response} from '@angular/http';
import {CountryService} from '../country/country.service';
import {Country} from '../country/country';

declare var $: any;

@Directive({
    selector: '[compBracket]'
})

export class BracketDirective {

    @Input() initData:any;
    @Input() tournament:Country;

    constructor(private el: ElementRef, private countryService: CountryService) {
        // we are using country and countryService for now for PoC purposes
        // this will have to change to use tournament and tournamentService once it exists
        // initData parameter will become tournament and the tournament object will be passed by a controller, just like
        // we currently do with the indexComponent
        this.tournament = new Country();
        this.tournament.name = "HOLA";
    }

    ngAfterViewInit() {
        this.el.nativeElement.style.backgroundColor = 'yellow';

        if (this.initData) {
            // USE userData as a way to pass "this" to the jquery plugin, so that we can call a service to perform
            // operations to store the bracket information
            $(this.el.nativeElement).bracket({
                init: this.initData,
                skipConsolationRound: true,
                centerConnectors: true,
                disableToolbar: true,
                disableTeamEdit: true,
                userData: this,
                save: this.saveFn, /* without save() labels are disabled */
                decorator: {edit: this.edit_fn,
                    render: this.render_fn}})
        }
    }


    /**
     * Called whenever bracket is modified
     *
     * data:     changed bracket object in format given to init
     * userData: optional data given when bracket is created.
     */
    saveFn(data, userData) {

        var json = JSON.stringify(data);
        console.log(json);
        /*const requestOptions = new RequestOptions();
        requestOptions.method = RequestMethod.Post;
        requestOptions.url = 'bracket';

        requestOptions.body = json;
        requestOptions.headers = new Headers({"Content-Type": "application/json"});

        return userData.http.request(new Request(requestOptions))
            .map((r: Response) => new Country(r.json()));*/
        userData.countryService.save(userData.tournament).subscribe((country: Country) => {
            console.log("hola");
        }, (res: Response) => {
            const json = res.json();

            console.log("bingo");
            console.log(json);
        });
    }

    /* Edit function is called when team label is clicked (not in use due to disableTeamEdit flag set to true) */
    edit_fn(container, data, doneCb) {
        var input = $('<input type="text">')
        input.val(data ? data.flag + ':' + data.name : '')
        container.html(input)
        input.focus()
        input.blur(function() {
            var inputValue = input.val()
            if (inputValue.length === 0) {
                doneCb(null); // Drop the team and replace with BYE
            } else {
                var flagAndName = inputValue.split(':') // Expects correct input
                doneCb({flag: flagAndName[0], name: flagAndName[1]})
            }
        });
    }

    render_fn(container, data, score, state) {
        switch(state) {
            case "empty-bye":
                container.append("BYE")
                return;
            case "empty-tbd":
                container.append("Upcoming")
                return;

            case "entry-no-score":
            case "entry-default-win":
            case "entry-complete":
                container.append('<span class="flag-icon flag-icon-' + data.flag + '"></span> ').append(data.name)
                return;
        }
    }
}
