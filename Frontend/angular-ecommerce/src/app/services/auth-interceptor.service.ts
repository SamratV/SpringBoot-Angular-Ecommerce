import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

/**
 * An interceptor is an angular class that intercepts a request
 * to the backend, clones the request, adds a token to the header
 * of the request and then sends it to the backend. This is done
 * to let the backend know that an authenticated user is trying
 * to access the protected backend service. The token added to the
 * header is not necessarily a JWT, it could be a normal token as
 * well. Token word is used here in general sense.
 */

@Injectable({
	providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

	constructor(private oktaAuth: OktaAuthService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return from(this.handleAccess(req, next));
	}

	private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
		const securedEndpoints = ['http://localhost:8080/api/orders'];

		if(securedEndpoints.some(url => request.urlWithParams.includes(url))) {
			// "await" means wait for an "async" call to finish.
			// "this.oktaAuth.getAccessToken()" is an "async" call.
			const accessToken = await this.oktaAuth.getAccessToken();

			// Clone the request and add an access token
			// to the header because requests are immutable.
			request = request.clone({
				setHeaders: {
					Authorization: 'Bearer ' + accessToken
				}
			});
		}

		return next.handle(request).toPromise();
	}
}
