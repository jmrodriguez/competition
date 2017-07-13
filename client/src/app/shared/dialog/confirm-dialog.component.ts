/**
 * Created by jmrodriguez on 7/13/17.
 */

import { MdDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialog {

    public title: string;
    public message: string;
    public primaryButtonText : string;
    public secondaryButtonText: string;

    constructor(public dialogRef: MdDialogRef<ConfirmDialog>) {

    }
}