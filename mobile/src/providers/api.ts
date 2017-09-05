import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://localhost:8080/api';
  simpleUrl: string = 'http://localhost:8080';
  constructor(public http: Http, private storage: Storage) {
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

     return Observable.fromPromise(this.buildHeaders(options))
      .switchMap((options) => {
        return this.http.get(this.url + '/' + endpoint, options);
      });

  }

  buildHeaders(options) {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    return this.storage.get('user').then((user) => {
      if(user && user.token) {
        options.headers.append("Content-Type", "application/json");
        options.headers.append('x-access-token', user.token);
        return options;
      } else {
        return options;
      }
    });
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    if(endpoint == 'login') {
      return this.http.post(this.url + '/' + endpoint, body, options);
    } else {
      return Observable.fromPromise(this.buildHeaders(options))
        .switchMap((options) => {
          return this.http.post(this.url + '/' + endpoint, body, options);
        });
    }

  }

  simplePost(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.simpleUrl + '/' + endpoint, body, options);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    if (body.params) {
      let p = new URLSearchParams();
      for (let k in body.params) {
        p.set(k, body.params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return Observable.fromPromise(this.buildHeaders(options))
      .switchMap((options) => {

        return this.http.put(this.url + '/' + endpoint, body, options);
      });
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  // getRequestOptionArgs(options?: RequestOptionsArgs)  {
  //   if (options == null) {
  //     options = new RequestOptions();
  //   }
  //   if (options.headers == null) {
  //     options.headers = new Headers();
  //   }
  //
  //   this.storage.get('user').then((user) => {
  //
  //
  //     options.headers.append('x-access-token', user.token);
  //
  //
  //   });
  //
  //   console.log(123)
  //
  //   return options;
  // }
}
