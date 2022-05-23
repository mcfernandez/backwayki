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
	selector: 'kt-clients-list',
	templateUrl: './list.component.html',
	styles: [`
		.label-success { color: #ffffff; background-color: #8bc34a; }
		.text-teal { color: #009688 !important; }
		.mat-header-row { background: #eef0f8; }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ClientListComponent implements OnInit, OnDestroy {
	listpagination: any;

	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['documenttypename', 'name', 'countryname', 'mobilenumber', 'status', 'modifiedon', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;

	_entityname = 'El cliente';
	_title: string = 'Clientes';
	_pathservice: string = 'client'
	_pathurl: string = "/administration/clients";

	filter: any = {
		numberdocument: null,
		name: null,
		documenttypeid: null,
		countryid: null
	};

	listDocumentType: any[] = [];
	listCountry: any[] = [];

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

	ngOnDestroy() {

	}

	getPagination() {
		this._commonService.List(`optionlist/listbykey/DocumentType`).subscribe((result: any[]) => {
			this.listDocumentType = result;
			this.listDocumentType.unshift({ id: "", name: "seleccione...", status: true });
		});

		this._commonService.List(`country/list`).subscribe((result: any[]) => {
			this.listCountry = result;
			this.listCountry.unshift({ id: "", name: "seleccione...", status: true });
		});

		let url: string = `${ this._pathservice }/list`;

		this._commonService.List(url).subscribe((result: any) => {
			this.listpagination = result;
			this.dataSource = new MatTableDataSource(this.listpagination);
			this.dataSource.paginator = this.paginator;
			this.dataSource.sort = this.sort;
			this.dataSource.sortingDataAccessor = (item, property) => {
				switch (property) {
					case 'mobilenumber': return item.mobilenumber + '';
					default: return item[property];
				}
			};
		});
	}

	setFilter() {
		this.filter.numberdocument = this.getValue(this.filter.numberdocument);
		this.filter.name = this.getValue(this.filter.name);
		this.filter.documenttypeid = this.getValue(this.filter.documenttypeid);
		this.filter.countryid = this.getValue(this.filter.countryid);

		let filtered = this.listpagination;

		if (this.filter.documenttypeid != "") {
			let item = this.listDocumentType.filter(m => m.id == this.filter.documenttypeid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.documenttypename == item[0].name);
		}

		if (this.filter.numberdocument != "")
			filtered = filtered.filter(m => m.documentnumber.includes(this.filter.numberdocument));

		if (this.filter.name != "")
			filtered = filtered.filter(m => m.name.includes(this.filter.name));

		if (this.filter.countryid != "") {
			let item = this.listCountry.filter(m => m.id == this.filter.countryid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.countryname == item[0].name);
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

	setShow(id) {
		this._commonService.Get(`${ this._pathservice }/${ id }`).subscribe((result: any) => {
			localStorage.setItem(`${ this._pathservice }-${ id}`, JSON.stringify(result));
			
			this.router.navigate([`${ this._pathurl}/view`, id], { relativeTo: this.activatedRoute });
		});		
	}

}
