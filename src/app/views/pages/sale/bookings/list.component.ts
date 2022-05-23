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
	selector: 'kt-booking-list',
	templateUrl: './list.component.html',	
	styles: [`
		.mat-column-code{ flex: 0 0 100px; }
		.mat-column-actions{ flex: 0 0 100px;    }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class BookingListComponent implements OnInit, OnDestroy {
	listpagination: any;

	dataSource: MatTableDataSource<any> | null;
	displayedColumns = ['name', 'tourname', 'contacto', 'advisername', 'startdate', 'passengers', 'amount', 'status', 'createdon', 'modifiedon', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;

	_entityname = 'La reserva';
	_title: string = 'Reservas';
	_pathservice: string = 'booking'
	_pathurl: string = "/sale/bookings";

	filter: any = {
		code: null,
		tourid: null,
		contactname: null,
		typeid: null,
		startdatebegin: null,
		startdateend: null,
		createdonbegin: null,
		createdonend: null,
		asesorname: null,
		createdname: null
	};

	listTour: any[] = [];
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
	}

	ngOnDestroy() {

	}

	getPagination() {
		this._commonService.List(`tour/list`).subscribe((result: any[]) => {
			this.listTour = result;
			this.listTour.unshift({ id: "", name: "seleccione...", isactive: true });
		});		

		this._commonService.List(`optionlist/listbykey/CategoriaPrecio`).subscribe((result: any[]) => {
			this.listType = result;
			this.listType.unshift({ id: "", name: "seleccione...", isactive: true });
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
		//let xf: any = { code: null, tourid: null, contactname: null, typeid: null, startdatebegin: null, startdateend: null, createdonbegin: null, createdonend: null };
		this.filter.code = this.getValue(this.filter.code);
		this.filter.tourid = this.getValue(this.filter.tourid);
		this.filter.contactname = this.getValue(this.filter.contactname);
		this.filter.typeid = this.getValue(this.filter.typeid);
		this.filter.asesorname = this.getValue(this.filter.asesorname);
		this.filter.createdname = this.getValue(this.filter.createdname);

		let filtered = this.listpagination;

		if (this.filter.code != "")
			filtered = filtered.filter(m => m.name.includes(this.filter.code));

		if (this.filter.tourid != "") {
			let item = this.listTour.filter(m => m.id == this.filter.tourid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.tourname == item[0].name);
		}

		if (this.filter.contactname != "")
			filtered = filtered.filter(m => m.contactname.includes(this.filter.contactname));

		if (this.filter.typeid != "") {
			let item = this.listType.filter(m => m.id == this.filter.typeid);

			if (item.length > 0)
				filtered = filtered.filter(m => m.tourtypename == item[0].name);
		}

		if (this.filter.startdatebegin != null) {
			let date = this.filter.startdatebegin.setHours(0, 0, 0, 0);
			filtered = filtered.filter(m => (new Date(m.startdate)) >= date);
		}

		if (this.filter.startdateend != null) {
			let date = this.filter.startdateend.setHours(23, 59, 59, 0);
			filtered = filtered.filter(m => (new Date(m.startdate)) <= date);
		}

		if (this.filter.createdonbegin != null) {
			let date = this.filter.createdonbegin.setHours(0, 0, 0, 0);
			filtered = filtered.filter(m => (new Date(m.createdon)) >= date);
		}

		if (this.filter.createdonend != null) {
			let date = this.filter.createdonend.setHours(23, 59, 59, 0);
			filtered = filtered.filter(m => (new Date(m.createdon)) <= date);
		}

		if (this.filter.asesorname != "")
			filtered = filtered.filter(m => m.advisername.includes(this.filter.asesorname));

		if (this.filter.createdname != "")
			filtered = filtered.filter(m => m.createdbyname.includes(this.filter.createdname));

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

	setResume(id) {
		this._commonService.Get(`${ this._pathservice }/${ id }/resume`).subscribe((result: any) => {
			localStorage.setItem(`${ this._pathservice }-${ id}`, JSON.stringify(result));
			
			this.router.navigate([`${ this._pathurl}/resume`, id], { relativeTo: this.activatedRoute });
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
