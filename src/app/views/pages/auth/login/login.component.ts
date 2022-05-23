import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';

import { AuthService } from 'src/app/core/auth/_services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	defaultAuth: any = {
		email: 'administrador',
		password: 'abc123',
	};

	loginForm: FormGroup;
	hasError: boolean;
	returnUrl: string;
	isLoading$: Observable<boolean>;
	
	constructor(private fb: FormBuilder, private Auth: AuthenticationService, private route: ActivatedRoute, private router: Router) {

	}
	
	ngOnInit(): void {
		if (environment.production) {
			this.defaultAuth.email = "";
			this.defaultAuth.password = "";
		}

		this.initForm();
		
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
	}
	
	get f() {
		return this.loginForm.controls;
	}
	
	initForm() {
		this.loginForm = this.fb.group({
		  	email: [
				this.defaultAuth.email,
				Validators.compose([
					Validators.required,
			  		Validators.email,
			  		Validators.minLength(3),
			  		Validators.maxLength(320), 
				]),
		  	],
		  	password: [
				this.defaultAuth.password,
				Validators.compose([
			  		Validators.required,
			  		Validators.minLength(3),
			  		Validators.maxLength(100),
				]),
		  	],
		});
	}
	
	submit() {
		this.Auth.postSession(this.loginForm.value.email, this.loginForm.value.password).subscribe((res: any) => {
			if (res) {
				var obj = JSON.parse(localStorage.getItem('infoauth'));
				
				if (obj.role.name == "Admin")
					this.router.navigate(['/dashboard'])
				else if (obj.role.name == "Finance" || obj.role.name == "Reservation")
					this.router.navigate(['/sale/notifications'])
				else
					this.router.navigate(['/sale/bookings']) 
			}
		});
	}
	
	ngOnDestroy() {
		
	}
	
}
