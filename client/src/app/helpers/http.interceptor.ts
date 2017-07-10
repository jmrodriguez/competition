import {Injectable, Injector} from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastCommunicationService} from "../shared/toast-communication.service";

@Injectable()
export class InterceptedHttp extends Http {

    private router;
    private authService;
    private translateService;
    private toastCommunicationService;

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private injector: Injector) {
        super(backend, defaultOptions);
    }

    /*get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(url, this.getRequestOptionArgs(options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.delete(url, this.getRequestOptionArgs(options));
    }*/

    //XXX: ALL REQUESTS GET/POST/PUT/DELETE GO THOUGH REQUEST BEFORE BEING SENT, SO WE ONLY NEED TO INTERCEPT HERE
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

        if (url instanceof String) {
            url = this.updateUrl(url);
        } else {
            let updatedUrl = this.updateUrl(url.url);
            url.url = updatedUrl;
        }

        return super.request(this.getRequestOptionArgs(url), options).catch(this.catchErrors());
    }

    private updateUrl(req: string) {
        // for i18n requests, we use the client server, not the api one
        if (req.indexOf("/assets/i18n") != -1) {
            return environment.clientUrl + req;
        }
        return  environment.serverUrl + req;
    }

    private getRequestOptionArgs(request?: string | Request) : string | Request {

        if (this.authService == null) {
            this.authService = this.injector.get(AuthService);
        }

        if (request instanceof Request) {
            if (request.headers == null) {
                request.headers = new Headers();
            }
            request.headers.append('Content-Type', 'application/json');

            let currentUser = this.authService.currentUser;
            if (currentUser != null) {
                request.headers.append('Authorization', "Bearer " + currentUser.access_token);
            }
        }

        return request;
    }

    private catchErrors() {

        return (res: Response) => {
            if (this.router == null) {
                this.router = this.injector.get(Router);
            }

            if (this.translateService == null) {
                this.translateService = this.injector.get(TranslateService);
            }

            if (this.toastCommunicationService == null) {
                this.toastCommunicationService = this.injector.get(ToastCommunicationService);
            }
            if (res.status === 403) {
                //handle authorization errors
                //in this example I am navigating to login.
                console.log("Error_Token_Expired: redirecting to login.");
                // call logout and redirect to login
                this.authService.logout();

                this.toastCommunicationService.showToast(this.toastCommunicationService.ERROR, 'auth.token.expired')

                this.router.navigate(['login']);
            }
            return Observable.throw(res);
        };
    }
}