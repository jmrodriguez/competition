import {Injectable} from '@angular/core';
import {ToastOptions, ToastyService} from "ng2-toasty";
import {TranslateService} from "@ngx-translate/core";


@Injectable()
export class ToastCommunicationService {

  SUCCESS: number = 0;
  WARNING: number = 1;
  ERROR: number = 2;

  constructor(private translateService: TranslateService,
              private toastyService: ToastyService) {
  }

  _getToastObject(title: string, msg: string) {
    // Or create the instance of ToastOptions
    var toastObject:ToastOptions = {
      title: title,
      msg: msg,
      showClose: true,
      timeout: 5000,
      theme: 'material'
    };

    return toastObject;
  }

  showToast(msgType: number, messageKey: string, params: any = {}) {
    let titleKey = 'toast.title.error';
    switch (msgType) {
      case this.SUCCESS:
        titleKey = 'toast.title.success';
        break;
      case this.WARNING:
        titleKey = 'toast.title.warning';
        break;
      case this.ERROR:
        titleKey = 'toast.title.error';
        break;
    }
    this.translateService.get([titleKey, messageKey], params).subscribe((strings: any) => {
      let toast = this._getToastObject(strings[titleKey], strings[messageKey]);
      switch (msgType) {
        case this.SUCCESS:
          this.toastyService.success(toast);
          break;
        case this.WARNING:
          this.toastyService.warning(toast);
          break;
        case this.ERROR:
          this.toastyService.error(toast);
          break;
      }
    });
  }
}