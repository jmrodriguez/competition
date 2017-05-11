import {Injectable} from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {environment} from "../../environments/environment";

@Injectable()
export class InterceptedHttp extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
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

        return super.request(this.getRequestOptionArgs(url), options);
    }

    private updateUrl(req: string) {
        return  environment.serverUrl + req;
    }

    private getRequestOptionArgs(request?: string | Request) : string | Request {

        if (request instanceof Request) {
            if (request.headers == null) {
                request.headers = new Headers();
            }
            request.headers.append('Content-Type', 'application/json');

            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (currentUser != null) {
                request.headers.append('Authorization', "Bearer " + currentUser.access_token);
            }
        }

        return request;
    }
}