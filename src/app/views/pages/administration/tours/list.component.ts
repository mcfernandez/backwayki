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
	.mat-column-actions{ flex: 0 0 80px; }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class TourListComponent implements OnInit, OnDestroy {
	listpagination: any;

	// Table fields
	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['code', 'name', 'typename', 'categoryname', 'duration', 'status', 'modifiedon', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;

	_title: string = 'Tours';
	_pathservice: string = 'tour'
	_pathurl: string = 'tours'

	permission: any[] = [];

	filter: any = {
		code: null,
		name: null,
		typeid: null
	};

	listType: any[] = [];

	constructor(
		private router: Router,
		public dialog: MatDialog,
		private activatedRoute: ActivatedRoute,
		public snackBar: MatSnackBar,
		private _commonService: CommonService,
		private layoutUtilsService: LayoutUtilsService) { 

	}

	ngOnInit() {
		this.getPagination();

		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 1, "administracion", "tour");
	}

	ngOnDestroy() {

	}

	Auth(id: number): boolean {
		return Authorization.Action(id, this.permission);
	}

	getPagination() {
		this._commonService.List(`optionlist/listbykey/TipoTour`).subscribe((result: any[]) => {
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
		this.filter.code = this.getValue(this.filter.code);
		this.filter.name = this.getValue(this.filter.name);
		this.filter.typeid = this.getValue(this.filter.typeid);

		let filtered = this.listpagination;

		if (this.filter.code != "")
			filtered = filtered.filter(m => m.code.includes(this.filter.code));

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
		this.router.navigate([`../${ this._pathurl}/create`], { relativeTo: this.activatedRoute });
	}

	setEdit(id) {
		let url: string = `${ this._pathservice }/${ id }`;

		this._commonService.Get(url).subscribe((result: any) => {
			localStorage.setItem(`${ this._pathservice }-${ id}`, JSON.stringify(result));
			
			this.router.navigate([`../${ this._pathurl}/edit`, id], { relativeTo: this.activatedRoute });
		});		
	}

    setChangeStatus(id, name, status) {
		let _entityname = 'El tour';
		let _statusname = status == true ? 'desactivado' : 'activado';
		const _title = '¿Está seguro de cambiar el estado?';
		const _warningMessage = `${ _entityname } ${ name } será ${ _statusname }`;
		const _waitMessage = `${ _entityname } ${ name } se está ${ status ? 'desactivando' : 'activando'}...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido ${ _statusname }`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			let url = `${ this._pathservice }/${ id }/changestatus`;

			this._commonService.ChangeStatus(url).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
					this.getPagination();
				}
			});
		});
	}

    setDelete(id, name) {
		let _entityname = 'El tour';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			let url = `${ this._pathservice }/${ id }/delete`;

			this._commonService.Delete(url).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
					this.getPagination();
				}
			});
		});
	}

}
