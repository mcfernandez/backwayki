// Angular
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';

import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { AppState } from 'src/app/core/reducers';
import { SecurityService } from 'src/app/services/security.service';
import { UtilitiesService } from 'src/app/services/utility.service';

@Component({
	selector: 'kt-roles-list',
	templateUrl: './roles-list.component.html',
	styles: [`
	mat-header-row {
		background: #eef0f8;
	}
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
}) 
export class RolesListComponent implements OnInit {
	
	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['nombre', 'descripcion', 'estado'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	
	roles: any;
	
	constructor(private store: Store<AppState>, public dialog: MatDialog, private _matDialog: MatDialog, public snackBar: MatSnackBar,
		        private _security: SecurityService, private _utilitiesService:UtilitiesService, 
				private layoutUtilsService: LayoutUtilsService) { 

	}

	ngOnInit() {
		this.getRole();
	}

	getRole() {
		this._security.getList(`role/list`).subscribe((value: any[]) => {
			this.roles = value;
			this.dataSource = new MatTableDataSource(this.roles);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}
	
}
