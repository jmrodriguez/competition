import { Component } from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ToastyConfig} from "ng2-toasty";

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(translateService: TranslateService,
              private toastyConfig: ToastyConfig) {

    toastyConfig.position = "top-right";
    toastyConfig.timeout = 5000;
    toastyConfig.showClose = true;
    toastyConfig.theme = "material";

    translateService.addLangs(["en", "es"]);
    // this language will be used as a fallback when a translation isn't found in the current language
    translateService.setDefaultLang('es');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let lang = localStorage.getItem("lang")
    translateService.use(lang != null && lang.match(/en|es/) ? lang : 'en');

    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      // saves the selected language in local storage to keep the selection when the user loads the pages again later
      localStorage.setItem("lang", event.lang);
    });
  }
}
