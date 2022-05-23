import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';
import { CommonService } from 'src/app/services/common.service';

@Component({
	selector: 'kt-corporateclient-list',
	templateUrl: './list.component.html',
	styles: [`
		.label-success { color: #ffffff; background-color: #8bc34a; }
		.text-teal { color: #009688 !important; }
		.mat-header-row { background: #eef0f8; }
		.demo-table { width: 100%; }
		.demo-button-container { padding-bottom: 16px; }
		.demo-button + .demo-button { margin-left: 8px; }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CorporateClientListComponent implements OnInit {
	listpagination: any;

	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['ruc', 'name', 'status', 'modifiedon', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	
	_entityname = "El cliente corporativo";
	_formname: string = "Cliente Corporativo";
	path: string = 'corporateclient';
	filter: any = {	ruc: '', name: '' };

	constructor(private router: Router, public dialog: MatDialog, private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar,
		        private _commonService: CommonService, private layoutUtilsService: LayoutUtilsService) { 

	}

	ngOnInit() {
		this.getPagination();
	}

	getPagination() {
		this._commonService.List(`${ this.path }/list`).subscribe((result: any) => {
			this.listpagination = result;
			this.dataSource = new MatTableDataSource(this.listpagination);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
		});
	}

	getValue(data: string): string {
		if ((data == "") || (data == undefined) || (data == null))
			return "";
			
		return data.trim();
	}

	setFilter() {
		this.filter.ruc = this.getValue(this.filter.ruc);
		this.filter.name = this.getValue(this.filter.name);

		let filtered = this.listpagination;

		if (this.filter.ruc != "")
			filtered = filtered.filter(m => m.ruc.includes(this.filter.ruc));

		if (this.filter.name != "")
			filtered = filtered.filter(m => m.name.includes(this.filter.name));

		this.dataSource = new MatTableDataSource(filtered);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	setCreate() {
		this.router.navigate([`../${ this.path }/create`], { relativeTo: this.activatedRoute });
	}

	setEdit(id) {
		this._commonService.Get(`${ this.path }/${ id }`).subscribe((result: any) => {
			localStorage.setItem(`${ this.path }-${ id }`, JSON.stringify(result));
			
			this.router.navigate([`../${ this.path }/edit`, id], { relativeTo: this.activatedRoute });
		});
	}

    setChangeStatus(id: string, name: string, status: boolean) {
		this.layoutUtilsService.deleteElement('¿Está seguro de cambiar el estado?', `${ this._entityname } ${ name } será ${ status ? 'desactivado' : 'activado' }`, `${ this._entityname } ${ name } se está ${ status ? 'desactivando' : 'activando' }...`).afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.ChangeStatus(`${ this.path }/${ id }/changestatus`).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(`${ this._entityname } ${ name } ha sido ${ status ? 'desactivado' : 'activado' }`, MessageType.Update);
					this.getPagination();
				}
			});
		});
	}

}
