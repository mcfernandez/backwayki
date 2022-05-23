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
  selector: 'kt-incidents-list',
	templateUrl: './list.component.html',	
	styles: [`
	.mat-column-status,.mat-column-actions{ flex: 0 0 100px; }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class IncidentListComponent implements OnInit {
	listpagination: any;

	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['code', 'name', 'typename', 'clientname', 'bookingname', 'advisername', 'statusname', 'modifiedon', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;

	_entityname = 'El incidente';
	_title: string = 'Incidentes';
	_pathservice: string = 'incident'
	_pathurl: string = "/incidents";

	permission: any[] = [];

	filter: any = {
		code: null,
		typeid: null,
		clientname: null,
		bookingcode: null,
		adviserid: null,
		statusid: null,
		createdonbegin: null,
		createdonend: null
	};

	listAdviser: any[] = [];
	listType: any[] = [];
	listStatus: any[] = [];

	constructor(private router: Router, public dialog: MatDialog, private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, private _commonService: CommonService, private layoutUtilsService: LayoutUtilsService) {

	}

	ngOnInit() {
		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 0, "incidente", "");
		
		this.getPagination();
	}

	ngOnDestroy() {

	}

	Auth(id: number): boolean {
		return Authorization.Action(id, this.permission);
	}

	getPagination() {
		this._commonService.List(`adviser/list`).subscribe((result: any[]) => {
			this.listAdviser = result;
			this.listAdviser.unshift({ id: "", name: "seleccione...", isactive: true });
		});		

		this._commonService.List(`optionlist/listbykey/TypeIncident`).subscribe((result: any[]) => {
			this.listType = result;
			this.listType.unshift({ id: "", name: "seleccione...", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/IncidentStatus`).subscribe((result: any[]) => {
			this.listStatus = result;
			this.listStatus.unshift({ id: "", name: "seleccione...", isactive: true });
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
		//let xf: any = {		code: null,	typeid: null,clientname: null,bookingcode: null,	adviserid: null,statusid: null,	createdonbegin: null,createdonend: null};
		this.filter.code = this.getValue(this.filter.code);
		this.filter.typeid = this.getValue(this.filter.typeid);
		this.filter.clientname = this.getValue(this.filter.clientname);
		this.filter.bookingcode = this.getValue(this.filter.bookingcode);
		this.filter.adviserid = this.getValue(this.filter.adviserid);
		this.filter.statusid = this.getValue(this.filter.statusid);

		let filtered = this.listpagination;

		if (this.filter.code != "")
			filtered = filtered.filter(m => m.code.includes(this.filter.code));

		if (this.filter.typeid != "") {
			let item = this.listType.filter(m => m.id == this.filter.typeid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.typename == item[0].name);
		}

		if (this.filter.clientname != "")
			filtered = filtered.filter(m => m.clientname.includes(this.filter.clientname));

		if (this.filter.bookingcode != "")
			filtered = filtered.filter(m => m.bookingname.includes(this.filter.bookingcode));
			
		if (this.filter.adviserid != "") {
			let item = this.listAdviser.filter(m => m.id == this.filter.adviserid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.advisername == item[0].name);
		}
			
		if (this.filter.statusid != "") {
			let item = this.listStatus.filter(m => m.id == this.filter.statusid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.statusname == item[0].name);
		}

		if (this.filter.createdonbegin != null) {
			let date = this.filter.createdonbegin.setHours(0, 0, 0, 0);
			filtered = filtered.filter(m => (new Date(m.createdon)) >= date);
		}

		if (this.filter.createdonend != null) {
			let date = this.filter.createdonend.setHours(23, 59, 59, 0);
			filtered = filtered.filter(m => (new Date(m.createdon)) <= date);
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

	setEdit(id) {
		this._commonService.Get(`${ this._pathservice }/${ id }`).subscribe((result: any) => {
			localStorage.setItem(`${ this._pathservice }-${ id}`, JSON.stringify(result));
			
			this.router.navigate([`${ this._pathurl}/edit`, id], { relativeTo: this.activatedRoute });
		});		
	}

}
