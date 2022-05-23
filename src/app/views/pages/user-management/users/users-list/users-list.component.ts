import { AfterViewInit, AfterViewChecked } from '@angular/core';
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Store, select } from '@ngrx/store';

import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { each, find } from 'lodash';
import { push } from 'object-path';
import Swal from 'sweetalert2';

import { AppState } from 'src/app/core/reducers';
import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';
import { User, Role, UsersDataSource, UserDeleted, UsersPageRequested, selectUserById, selectAllRoles } from 'src/app/core/auth';
import { SubheaderService } from 'src/app/core/_base/layout';
import { SecurityService } from 'src/app/services/security.service';
import { UserRolesListComponent } from 'src/app/views/pages/user-management/users/_subs/user-roles/user-roles-list.component';
import { ChangePasswordComponent } from 'src/app/views/pages/user-management/users/_subs/change-password/change-password.component';
import { EditUserComponent } from 'src/app/views/pages/user-management/users/_subs/edit-user/edit-user.component';

@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	styles: [`.label-success {
		color: #ffffff;
		background-color: #8bc34a;
	}
	.text-teal {
		color: #009688 !important;
	}
	mat-header-row {
		background: #eef0f8;
	}
	.mat-column-actions{
		flex: 0 0 180px;  
	  }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy {
	estados = [
		{ value: '', viewValue: 'seleccionar' },
		{ value: '1', viewValue: 'Activo' },
		{ value: '2', viewValue: 'Inactivo' }
	];

	private subscriptions: Subscription[] = [];
	ListUser: any[] = [];
	ListRole: any[] = [];

	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['usuario', 'login', 'celular', 'correo', 'estado', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;

	roles: any;
	buscar_filtro: any = "";
	filtro_estado: string = "";
	filtro_correo: string = "";
	filtro_role: string = "";
	user: any;

	constructor(private store: Store<AppState>, private router: Router, public dialog: MatDialog, private activatedRoute: ActivatedRoute,
		        public snackBar: MatSnackBar, private _matDialog: MatDialog, private _security: SecurityService, private layoutUtilsService: LayoutUtilsService) { 

	}

	filterCustom() {
		this.filtro_estado = this.getValue(this.filtro_estado);
		this.buscar_filtro = this.getValue(this.buscar_filtro);
		this.filtro_correo = this.getValue(this.filtro_correo);
		this.filtro_role = this.getValue(this.filtro_role);

		let filtered = this.user;

		if (this.filtro_estado != "")
			filtered = filtered.filter(m => m.status == (this.filtro_estado == "1"));

		if (this.buscar_filtro != "")			
			filtered = filtered.filter(m => m.fullname.includes(this.buscar_filtro));

		if (this.filtro_correo != "")
			filtered = filtered.filter(m => m.email.includes(this.filtro_correo));

		if (this.filtro_role != "")
			filtered = filtered.filter(m => m.roleid == this.filtro_role);

		this.dataSource = new MatTableDataSource(filtered);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	getValue(data: string): string {
		if ((data == "") || (data == undefined) || (data == null))
			return "";
			
		return data.trim();
	}

	ngOnInit() {
		this.getListUser();
		this.getRoleList();
	}

	getListUser() {
		this._security.getList(`user/list`).subscribe((value: any) => {
			this.user = value;

			for (var i = 0; i < this.user.length; i++)
				this.user[i].fullname = `${ this.user[i].name } ${ this.user[i].lastname }`;

			this.dataSource = new MatTableDataSource(this.user);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
			this.filtro_estado = "";
		});
	}

	getRoleList() {
		this._security.getList(`role/list`).subscribe((value: any) => {
			this.ListRole = value;
			this.ListRole.unshift({ id: "", name: "seleccionar" });
		});
	}

	ngOnDestroy() {

	}	
	
	editUser() {
		this.router.navigate(['../users/edit', 0], { relativeTo: this.activatedRoute });
	}

	editUser_modal(data: any): void {
		const dialogRef = this._matDialog.open(EditUserComponent, { width: '60em', height: '30em', data: data });

		dialogRef.afterClosed().subscribe(result => {
			this.getListUser();
		});
	}

	openModalRol(data: any): void {
		const dialogRef = this._matDialog.open(UserRolesListComponent, { width: '60em', height: '19em', data: data });

		dialogRef.afterClosed().subscribe(result => {
			this.getListUser();
		});
	}

	openModalPassword(data: any): void {
		const dialogRef = this._matDialog.open(ChangePasswordComponent, { width: '35em', height: '25em', data: data });

		dialogRef.afterClosed().subscribe(result => {
			this.getListUser();
		});
	}

	deleteUser(_item, nombre, apellido, estado) {
		let status = estado == true ? 'Desactivado' : 'Activado';
		const _title = '¿Esta seguro?';
		const _description = `Usuario ${ nombre } ${ apellido } será ${ status }`;
		const _waitDesciption = `Usuario ${ nombre } ${ apellido } se está ${ estado == true ? 'Desactivando' : 'Activando' }...`;
		const _deleteMessage = `Usuario ha sido ${ status }`;
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);

		dialogRef.afterClosed().subscribe(res => {
			if (!(res))
				return;

			this._security.updateUser({}, `user/${ _item }/change/status`).subscribe((res: any) => {
				if (res == true) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.getListUser();
				}
			});
		});
	}

}
