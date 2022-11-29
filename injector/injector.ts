import {Injectable} from "@angular/core";
import {StorageService} from "./../service/storage.service";
import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {finalize, tap} from "rxjs";
import {environment} from "../../environments/environment";
import {publicRoutesService} from "../service/publicRoutes.service";
import {Store} from "@ngrx/store";
import {logout} from "../actions/login-action";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private service : StorageService,
    private routeService: publicRoutesService,
    private store: Store<{ logged: boolean}>
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = 'Bearer ' + this.service.get('token');

    let headers = req.headers;
    if(-1 === this.routeService.get().findIndex(elem => {
      let regexp = new RegExp(elem);
      return !!(req.url.match(regexp))
    })) {
      headers = req.headers.set('Authorization', authToken);
    }
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      url: req.url.match(new RegExp('upload')) ? req.url : environment.api + req.url,
      headers: headers,
    });

    let ok : string;
    const started = Date.now();

    // send cloned request with header to the next handler.
    return next.handle(authReq)
      .pipe(
        tap({
          // Succeeds when there is a response; ignore other events
          next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
          // Operation failed; error is an HttpErrorResponse
          error: (error) => { ok = 'failed'; console.log(error)
            if(error.status === 401) {
              this.store.dispatch(logout());
            }
          }
        }),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
          console.log(msg);
        })
      )
      ;
  }
}
