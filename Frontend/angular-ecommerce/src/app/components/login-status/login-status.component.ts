import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
	selector: 'app-login-status',
	templateUrl: './login-status.component.html',
	styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

	userFullName: string;
	isAuthenticated: boolean = false;

	storage: Storage = sessionStorage;

	constructor(private oktaAuthService: OktaAuthService) { }

	ngOnInit(): void {
		this.oktaAuthService.$authenticationState.subscribe(
			(result) => {
				this.isAuthenticated = result;
				this.getUserDetails();
			}
		);
	}

	getUserDetails() {
		if(this.isAuthenticated) {
			this.oktaAuthService.getUser().then(
				(result) => {
					this.userFullName = result.name;
					this.storage.setItem('userEmail', JSON.stringify(result.email));
				}
			);
		}
	}

	logout() {
		sessionStorage.removeItem('userEmail');
		this.oktaAuthService.signOut();
	}
}
