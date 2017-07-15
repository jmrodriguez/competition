import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, UrlSegment} from '@angular/router';
import {User} from './user';
import {UserService} from './user.service';
import {Response} from "@angular/http";
import {Federation} from "../federation/federation";
import {FederationService} from "../federation/federation.service";
import {AuthService} from "../services/auth.service";
import {ListResult} from "../helpers/list-result.interface";


@Component({
  selector: 'user-persist',
  templateUrl: './user-persist.component.html'
})
export class UserPersistComponent implements OnInit {

  user = new User();
  create = true;
  errors: any[];
  federationList: Federation[];
  showFederationSelect:boolean = false;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private federationService: FederationService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.user.accountLocked = false;
    this.user.accountExpired = false;
    this.user.passwordExpired = false;
    this.user.enabled = true;

    this.route.url.subscribe((url: UrlSegment[]) => {
      let target  = url[url.length - 1].path;
      this.route.params.subscribe((params: Params) => {
        if (this.authService.hasRole(["ROLE_SUPER_ADMIN"])) {
          this.showFederationSelect = true;
          this.federationService.list().subscribe((federationList: ListResult<Federation>) => {
            this.federationList = federationList.list;
            for (var i = 0; i < this.federationList.length; i++) {
              if (this.user.federation != null && this.federationList[i].id == this.user.federation.id) {
                this.user.federation = this.federationList[i];
                break;
              }
            }
          });
        }
        if (params.hasOwnProperty('id')) {
            this.userService.get(+params['id']).subscribe((user: User) => {
              this.create = false;
              this.user = user;
            });
        } else {
          if (target == "edit") {
            this.userService.get(this.authService.currentUser.userDetails.id).subscribe((user: User) => {
              this.create = false;
              this.user = user;
            });
          }
        }
      });
    });
  }

  save() {
    this.userService.save(this.user).subscribe((user: User) => {
      this.router.navigate(['/user', 'show', user.id]);
    }, (res: Response) => {
      const json = res.json();
      if (json.hasOwnProperty('message')) {
        this.errors = [json];
      } else {
        this.errors = json._embedded.errors;
      }
    });
  }
}
