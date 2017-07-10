import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {ToastCommunicationService} from "../shared/toast-communication.service";

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
              private toastCommunicationService: ToastCommunicationService,) {
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
              this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'login.failed');
            });
  }

}
