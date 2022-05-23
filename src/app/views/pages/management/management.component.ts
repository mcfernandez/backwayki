// Angular
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { Store } from '@ngrx/store';
// AppState
import { AppState } from 'src/app/core/reducers';
// Auth
import { Permission } from 'src/app/core/auth';

@Component({
	selector: 'kt-management',
	templateUrl: './management.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ManagementComponent implements OnInit {
	
	currentUserPermission$: Observable<Permission[]>;

	constructor(private store: Store<AppState>, private router: Router) {

	}

	ngOnInit() {

	}

}
