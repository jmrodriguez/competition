/**
 * Created by jmrodriguez on 7/13/17.
 */

import { Observable } from 'rxjs/Rx';
import { ConfirmDialog } from './confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class DialogsService {

    constructor(private dialog: MatDialog,
                private translateService: TranslateService) { }

    public confirm(titleKey: string, messageKey: string, params: any = {}): Observable<boolean> {

        let dialogRef: MatDialogRef<ConfirmDialog>;
        dialogRef = this.dialog.open(ConfirmDialog);
        let primaryButtonKey = "confirmation.dialog.button.ok";
        let secondaryButtonKey = "confirmation.dialog.button.cancel";
        this.translateService.get([titleKey, messageKey, primaryButtonKey, secondaryButtonKey], params).subscribe((strings: any) => {
            dialogRef.componentInstance.title = strings[titleKey];
            dialogRef.componentInstance.message = strings[messageKey];
            dialogRef.componentInstance.primaryButtonText = strings[primaryButtonKey];
            dialogRef.componentInstance.secondaryButtonText = strings[secondaryButtonKey];
        });

        return dialogRef.afterClosed();
    }
}