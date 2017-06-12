import {Component} from '@angular/core';
import {NavService} from './nav.service';
import {Router} from '@angular/router';
import {OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  applicationData: any;

  constructor(private navService: NavService, private authService: AuthService, private router: Router, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.navService.getNavData().subscribe(res => this.applicationData = res);
  }

  login() {
    this.router.navigate(["/login"]);
  }
}
