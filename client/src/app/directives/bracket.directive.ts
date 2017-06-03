/**
 * Created by jmrodriguez on 6/2/17.
 */

import { Directive, ElementRef, Input } from '@angular/core';
declare var $: any;

@Directive({
    selector: '[compBracket]'
})

export class BracketDirective {

    @Input() initData:any;

    constructor(private el: ElementRef) {

    }

    ngAfterViewInit() {
        this.el.nativeElement.style.backgroundColor = 'yellow';

        if (this.initData) {
            $(this.el.nativeElement).bracket({ init: this.initData /* data to initialize the bracket with */ })
        }
    }
}
