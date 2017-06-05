import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {User} from './user';
import {UserService} from './user.service';

@Component({
  selector: 'user-persist',
  templateUrl: './user-show.component.html'
})
export class UserShowComponent implements OnInit {

  user = new User();

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.userService.get(+params['id']).subscribe((user: User) => {
        this.user = user;
      });
    });
  }

  destroy() {
    if (confirm("Are you sure?")) {
      this.userService.destroy(this.user).subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/user','list']);
        } else {
          alert("Error occurred during delete");
        }
      });
    }
  }

}
