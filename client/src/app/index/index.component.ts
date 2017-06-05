import {Component, OnInit} from '@angular/core';
import {NavService} from '../nav/nav.service';
import {Route, Router} from '@angular/router';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  controllers: Array<any>;
  serverUrl: string;
  initData: any;

  constructor(private navService: NavService, private router: Router) { }

  ngOnInit(): void {
    this.serverUrl = environment.serverUrl;
    this.navService.getNavData().subscribe(applicationData => {
      this.controllers = applicationData.controllers.sort((a: any, b: any) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    // this.initData = {
    //   teams : [
    //     ["Team 1", "Team 2"], /* first matchup */
    //     ["Team 3", "Team 4"]  /* second matchup */
    //   ],
    //   results : [
    //     [[1,2], [3,4]],       /* first round */
    //     [[4,6], [2,1]]        /* second round */
    //   ]
    // };

    this.initData = {
      teams : [
        [{name: "A 1", flag: 'fi'}, null],
        [{name: "B 3", flag: 'se'}, {name: "C 4", flag: 'us'}],
        [{name: "A 1", flag: 'fi'}, null],
        [{name: "B 3", flag: 'se'}, {name: "C 4", flag: 'us'}],
        [{name: "A 1", flag: 'fi'}, null],
        [{name: "B 3", flag: 'se'}, {name: "C 4", flag: 'us'}],
        [{name: "A 1", flag: 'fi'}, null],
        [{name: "B 3", flag: 'se'}, {name: "C 4", flag: 'us'}]
      ],
      results : []
    }
  }

  hasRoute(controllerName: string): boolean {
    return this.router.config.some((route: Route) => {
      if (route.path === controllerName) {
        return true;
      }
    });
  }
}
