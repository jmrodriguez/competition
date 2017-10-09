import { Injectable }       from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
}                           from '@angular/router';
import { AuthService }      from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLogin(route, state);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        let routeData = route.data;

        if (routeData && routeData.roles && routeData.roles.length == 0) {
            // no roles needed, let them through
            return true;
        }

        if (this.authService.isAuthenticated()) {
            // logged in, now check roles if any
            if (routeData && routeData.roles) {
                if (this.authService.hasRole(routeData.roles)) {
                    return true;
                } else {
                    // user does not have the required role, direct to index
                    this.router.navigate(['/index']);
                    return false;
                }
            }
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: url }});
        return false;
    }

}