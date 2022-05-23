// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';
import { CommonService } from 'src/app/services/common.service';
import { DashboardBookingComponent } from 'src/app/views/pages/dashboard/booking.component';

@Component({
  selector: 'kt-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
  		.mat-column-actions{ flex: 0 0 60px; }
	`],
})

export class DashboardComponent implements OnInit {

  listBooking: any = [];
  listIncident: any = [];

  ROLEUSER: string = "64ee1313-e3f7-4dcd-b02e-2a913e86b28f";
  show: boolean = true;
  roleid: string = "";

  dataSource: MatTableDataSource<any> | null;
  dataIncident: MatTableDataSource<any> | null;
  displayedColumns = ['tourname', 'contactname', 'tourtypename', 'startdate', 'actions'];
  columnsIncident = ['name', 'clientname', 'bookingname', 'createdon', 'actions'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('sort1', { static: true }) sort: MatSort;
  @ViewChild('sort2', { static: true }) sort2: MatSort;

  constructor(public dialog: MatDialog, private _commonService: CommonService, private layoutUtilsService: LayoutUtilsService) {

  }

  ngOnInit() {
	this.roleid = (JSON.parse(localStorage.getItem('infoauth'))).role.id;
    this.show = !(this.roleid == this.ROLEUSER);
	
	if (this.show) {
		this.getBooking();
		this.getIncident();
	}
  }

  getBooking() {
  	let url: string = `booking/listadviserwo`;
  
  	this._commonService.List(url).subscribe((result: any) => {
  	  this.listBooking = result;
  	  this.dataSource = new MatTableDataSource(this.listBooking);
  	  this.dataSource.paginator = this.paginator;
  	  this.dataSource.sort = this.sort;
  	});
  }

  getIncident() {
  	let url: string = `incident/listadviserwo`;
  
  	this._commonService.List(url).subscribe((result: any) => {
  	  this.listIncident = result;
  	  this.dataIncident = new MatTableDataSource(this.listIncident);
  	  this.dataIncident.paginator = this.paginator;
  	  this.dataIncident.sort = this.sort2;
  	});
  }

  setBooking(id: string) {
	const dialogRef = this.dialog.open(DashboardBookingComponent, { width: '25em', height: '17em', data: { bookingid: id, type: "booking" } });

	dialogRef.afterClosed().subscribe(result => { this.getBooking(); });
  }

  setIncident(id: string) {
	const dialogRef = this.dialog.open(DashboardBookingComponent, { width: '25em', height: '17em', data: { bookingid: id, type: "incident" } });

	dialogRef.afterClosed().subscribe(result => { this.getBooking(); });
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
