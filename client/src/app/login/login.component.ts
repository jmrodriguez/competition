import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {FlashMessagesService} from 'ngx-flash-messages';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private flashMessagesService: FlashMessagesService,
              private translateService: TranslateService,) {
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authService.login(this.model.email, this.model.password)
        .subscribe(
            data => {
              this.router.navigate([this.returnUrl]);
            },
            error => {
              this.loading = false;
              this.translateService.get('login.failed', {}).subscribe((res: string) => {
                this.flashMessagesService.show(res, { classes: ['alert-danger'], timeout: 5000 });
              });
            });
  }

}
