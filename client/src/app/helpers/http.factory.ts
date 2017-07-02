import {XHRBackend, Http, RequestOptions} from "@angular/http";
import {InterceptedHttp} from "./http.interceptor";
import {Injector} from "@angular/core";


export function HttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, injector: Injector): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, injector);
}