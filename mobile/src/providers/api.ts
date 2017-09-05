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

    // Support easy query params for GET requests
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

   // this.storage.get('user').then((user) => {console.log(user.token)})

   //  options.headers.append("Content-Type", "application/json");
   // options.headers.append('x-access-token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTlhZTU3MzUxNDgwMTEwYTE0Nzc4MTcyIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmRDb25mIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsInVzZXJuYW1lIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJzdHJlZXQiOiJpbml0IiwiY2l0eSI6ImluaXQiLCJvcmdhbml6YXRpb24iOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJwYXNzd29yZENvbmYiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJzdHJlZXQiOnRydWUsImNpdHkiOnRydWUsIm9yZ2FuaXphdGlvbiI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsImVtYWlsIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJwYXRoc1RvU2NvcGVzIjp7fSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmRDb25mIjoiJDJhJDA1JE9DdFJiMHFMVmw3eWVIRzRCeTUzU09tZ0UuSktFRnE5VjAvWUtRU3ZBcHd1d2hYUnBqMWJxIiwicGFzc3dvcmQiOiIkMmEkMDUkT0N0UmIwcUxWbDd5ZUhHNEJ5NTNTT21nRS5KS0VGcTlWMC9ZS1FTdkFwd3V3aFhScGoxYnEiLCJzdHJlZXQiOiLQn9GD0YjQutC40L3QsCAzNNCQIiwiY2l0eSI6ItCl0LDRgNGM0LrQvtCyIiwib3JnYW5pemF0aW9uIjoiRGF4eCIsInVzZXJuYW1lIjoi0JjQstCw0L0iLCJlbWFpbCI6ImRvbW5pY2guaXZhbkBnbWFpbC5jb20iLCJfaWQiOiI1OWFlNTczNTE0ODAxMTBhMTQ3NzgxNzIifSwiJGluaXQiOnRydWUsImlhdCI6MTUwNDU5ODQ2NCwiZXhwIjoxNTA0Njg0ODY0fQ.X3X2AMrE80_cyzAXkPEZcNlM-YjUJ-3yPGbAjUN0qXM");
   //
   //  return this.http.get(this.url + '/' + endpoint, options);


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


        console.log(options.headers['x-access-token'])
        return options;
      } else {
        return options;
      }
    });
  }

  post(endpoint: string, body: any, options?: RequestOptions) {

    //
    // options.headers.append('x-access-token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTlhYTcyMGRmYTFhMTAyOTJjOTA4MTk3Iiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmRDb25mIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsInVzZXJuYW1lIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJzdHJlZXQiOiJpbml0IiwiY2l0eSI6ImluaXQiLCJvcmdhbml6YXRpb24iOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJwYXNzd29yZENvbmYiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJzdHJlZXQiOnRydWUsImNpdHkiOnRydWUsIm9yZ2FuaXphdGlvbiI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsImVtYWlsIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJwYXRoc1RvU2NvcGVzIjp7fSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmRDb25mIjoiJDJhJDA1JE1xc09vUjFZWUk5LjlLTkRuMTlxZHVqSThybVQ2T3JWWHkwNlJQVExaRk5GelAzVEdMNWNhIiwicGFzc3dvcmQiOiIkMmEkMDUkTXFzT29SMVlZSTkuOUtORG4xOXFkdWpJOHJtVDZPclZYeTA2UlBUTFpGTkZ6UDNUR0w1Y2EiLCJzdHJlZXQiOiJlcXciLCJjaXR5IjoiZXF3Iiwib3JnYW5pemF0aW9uIjoiZXF3IiwidXNlcm5hbWUiOiJxd2UiLCJlbWFpbCI6ImVhQGVhLmNvbSIsIl9pZCI6IjU5YWE3MjBkZmExYTEwMjkyYzkwODE5NyJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTA0MzQ1MDYxLCJleHAiOjE1MDQ0MzE0NjF9.Rp2B2C_Z2MXJ-mzHGyQQcNEZvF7bTsDnsFIWkg1D7Dc");
    //
    //
    // console.log(options, 'optionsoptions')


   //  options.headers.append("Content-Type", "x-www-form-urlencoded");
   // options.headers.append('x-access-token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNTlhYTcyMGRmYTFhMTAyOTJjOTA4MTk3Iiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmRDb25mIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsInVzZXJuYW1lIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJzdHJlZXQiOiJpbml0IiwiY2l0eSI6ImluaXQiLCJvcmdhbml6YXRpb24iOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJwYXNzd29yZENvbmYiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJzdHJlZXQiOnRydWUsImNpdHkiOnRydWUsIm9yZ2FuaXphdGlvbiI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsImVtYWlsIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJwYXRoc1RvU2NvcGVzIjp7fSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7Il9fdiI6MCwicGFzc3dvcmRDb25mIjoiJDJhJDA1JE1xc09vUjFZWUk5LjlLTkRuMTlxZHVqSThybVQ2T3JWWHkwNlJQVExaRk5GelAzVEdMNWNhIiwicGFzc3dvcmQiOiIkMmEkMDUkTXFzT29SMVlZSTkuOUtORG4xOXFkdWpJOHJtVDZPclZYeTA2UlBUTFpGTkZ6UDNUR0w1Y2EiLCJzdHJlZXQiOiJlcXciLCJjaXR5IjoiZXF3Iiwib3JnYW5pemF0aW9uIjoiZXF3IiwidXNlcm5hbWUiOiJxd2UiLCJlbWFpbCI6ImVhQGVhLmNvbSIsIl9pZCI6IjU5YWE3MjBkZmExYTEwMjkyYzkwODE5NyJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTA0MzQ1MDYxLCJleHAiOjE1MDQ0MzE0NjF9.Rp2B2C_Z2MXJ-mzHGyQQcNEZvF7bTsDnsFIWkg1D7Dc");
   //
   //  return this.http.post(this.url + '/' + endpoint, body, options);


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
