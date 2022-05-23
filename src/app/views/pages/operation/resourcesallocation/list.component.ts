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

@Component({
	selector: 'kt-resourcesallocation-list',
	templateUrl: './list.component.html',
	styles: [`
		.label-success { color: #ffffff; background-color: #8bc34a; }
		.text-teal { color: #009688 !important; }
		.mat-header-row { background: #eef0f8; }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ResourceAllocationListComponent implements OnInit, OnDestroy {
	listpagination: any;

	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['typeservicename', 'passenger', 'departuredate', 'status', 'modifiedon', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;

	_entityname = 'La asignación de recursos';
	_title: string = 'Asignación de recursos';
	_pathservice: string = 'resourceallocation'
	_pathurl: string = "/operation/resourcesallocation";

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
	}

	getPagination() {
		let url: string = `${ this._pathservice }/list`;

		this._commonService.List(url).subscribe((result: any) => {
			this.listpagination = result;
			this.dataSource = new MatTableDataSource(this.listpagination);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	ngOnDestroy() {

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

	ConvertDate(date: string, isDateTime: boolean): string {
	  try {
		var today = new Date(date);    
		var day = today.getDate() + "";
		var month = (today.getMonth() + 1) + "";
		var year = today.getFullYear() + "";
		var hour = today.getHours() + "";
		var minutes = today.getMinutes() + "";
		var seconds = today.getSeconds() + "";
  
		day = (day.length == 1) ? "0" + day : day;
		month = (month.length == 1) ? "0" + month : month;
		year = (year.length == 1) ? "000" + year : ((year.length == 2) ? "00" + year : ((year.length == 3) ? "0" + year : year));
		hour = (hour.length == 1) ? "0" + hour : hour;
		minutes = (minutes.length == 1) ? "0" + minutes : minutes;
		seconds = (seconds.length == 1) ? "0" + seconds : seconds;
  
		if (isDateTime)
		  return `${ day }/${ month }/${ year } ${ hour }:${ minutes }`;
  
		return `${ day }/${ month }/${ year }`;
	  }
	  catch (e) {
		return "";
	  }
	}

}
