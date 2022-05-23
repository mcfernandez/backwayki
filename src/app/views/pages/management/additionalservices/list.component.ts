// Angular
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';

import { CommonService } from 'src/app/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Authorization } from 'src/app/app.utility';

@Component({
	selector: 'kt-additionalservices-list',
	templateUrl: './list.component.html',
	styles: [`
		.mat-column-code{ flex: 0 0 100px; }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdditionalServiceListComponent implements OnInit, OnDestroy {
	listpagination: any;

	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['name', 'typename', 'price', 'status', 'modifiedon', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;

	_entityname = 'El servicio adicional';
	_title: string = 'Servicios adicionales';
	_pathservice: string = 'additionalservice'
	_pathurl: string = "/management/additionalservices";

	filter: any = {
		code: null,
		name: null,
		typeid: null
	};

	listType: any[] = [];

	permission: any[] = [];

	constructor(
		private router: Router,
		public dialog: MatDialog,
		private activatedRoute: ActivatedRoute,
		public snackBar: MatSnackBar,
		private _commonService: CommonService,
		private layoutUtilsService: LayoutUtilsService) { 

	}

	ngOnInit() {
		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 1, "gestion", "servicioadicional");
		this.getPagination();
	}

	ngOnDestroy() {

	}

	Auth(id: number): boolean {
		return Authorization.Action(id, this.permission);
	}

	getPagination() {
		this._commonService.List(`optionlist/listbykey/TypeAdditionalService`).subscribe((result: any[]) => {
			this.listType = result;
			this.listType.unshift({ id: "", name: "seleccione...", status: true });
		});

		let url: string = `${ this._pathservice }/list`;

		this._commonService.List(url).subscribe((result: any) => {
			this.listpagination = result;
			this.dataSource = new MatTableDataSource(this.listpagination);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	setFilter() {
		this.filter.name = this.getValue(this.filter.name);
		this.filter.typeid = this.getValue(this.filter.typeid);

		let filtered = this.listpagination;

		if (this.filter.name != "")
			filtered = filtered.filter(m => m.name.includes(this.filter.name));

		if (this.filter.typeid != "") {
			let item = this.listType.filter(m => m.id == this.filter.typeid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.typename == item[0].name);
		}

		this.dataSource = new MatTableDataSource(filtered);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	getValue(data: string): string {
		if ((data == "") || (data == undefined) || (data == null))
			return "";
			
		return data.trim();
	}

	setCreate() {
		this.router.navigate([`${ this._pathurl}/create`], { relativeTo: this.activatedRoute });
	}

	setEdit(id) {
		this._commonService.Get(`${ this._pathservice }/${ id }`).subscribe((result: any) => {
			localStorage.setItem(`${ this._pathservice }-${ id}`, JSON.stringify(result));
			
			this.router.navigate([`${ this._pathurl}/edit`, id], { relativeTo: this.activatedRoute });
		});		
	}

    setChangeStatus(id, name, status) {
		let _statusname = status == true ? 'desactivado' : 'activado';
		const _title = '¿Está seguro de cambiar el estado?';
		const _warningMessage = `${ this._entityname } ${ name } será ${ _statusname }`;
		const _waitMessage = `${ this._entityname } ${ name } se está ${ status ? 'desactivando' : 'activando'}...`;
		const _resultMessage = `${ this._entityname } ${ name } ha sido ${ _statusname }`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.ChangeStatus(`${ this._pathservice }/${ id }/changestatus`).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
					this.getPagination();
				}
			});
		});
	}

    setDelete(id, name) {
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ this._entityname } ${ name }`;
		const _waitMessage = `${ this._entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ this._entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
					this.getPagination();
				}
			});
		});
	}

}