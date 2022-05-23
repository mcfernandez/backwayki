// Angular
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// RxJS
import { Observable } from 'rxjs';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';
import { CreateNotificationComponent } from './createnotification.component';
import { UpdateDateComponent } from './updatedate.component';

@Component({
	selector: 'kt-booking-form',
	templateUrl: './form.component.html',
})

export class BookingFormComponent implements OnInit, OnDestroy {
	@ViewChild('_serviceincludedname', { static: false }) _serviceincludedname: ElementRef;
	@ViewChild('_servicenotincludedname', { static: false }) _servicenotincludedname: ElementRef;
	@ViewChild('_paymenttransactioncode', { static: false }) _paymenttransactioncode: ElementRef;
	@ViewChild('_assignmentname', { static: false }) _assignmentname: ElementRef;
	@ViewChild('_passengeramount', { static: false }) _passengeramount: ElementRef;
	@ViewChild('_additionalservicequantity', { static: false }) _additionalservicequantity: ElementRef;
	@ViewChild('_hotelquantity', { static: false }) _hotelquantity: ElementRef;
	@ViewChild('_itineraryname', { static: false }) _itineraryname: ElementRef;
	
	loading$: Observable<boolean>;
	
	role: number = 0;

	selectedTab = 0;

	id: string = "";
	name: string = "";
	tourid: string = "";
	tourname: string = "";
	tourtypename: string = "";
	//startdate: Date = null;
	//enddate: Date = null;
	startdate: string = null;
	enddate: string = null;
	passengers: number = 0;
	adultpassengers: number = 0;
	childrenpassengers: number = 0;
	studentpassengers: number = 0;
	adultprice: number = 0;
	childrenprice: number = 0;
	studentprice: number = 0;
	babypassengers: number = 0;
	categoryname: string = "";
	contactname: string = "";
	contactemail: string = "";
	createdname: string = "";
	amount: number = 0;
	debt: number = 0;
	ispackage: boolean = false;
	hotelnight?: number = null;
	description: string = "";
	observation: string = "";

	changedate: boolean = false;
	changepassenger: boolean = false;
	changeadditionalservice: boolean = false;
	changehotel: boolean = false;

	listTypeAssignment: any[] = [];
	listCustomerType: any[] = [];
	listRoomType: any[] = [];
	listHotelType: any[] = [];
	listTourAdditionalService: any[] = [];
	listTourHotel: any[] = [];
	lstHotel: any[] = [];
	lstServiceMode: any[] = [];

	listServiceIncluded: any[] = [];
	serviceincluded: any = { id: "", name: "", description: "", isEdit: false };
	listServiceNotIncluded: any[] = [];
	servicenotincluded: any = { id: "", name: "", description: "", isEdit: false };
	listPayment: any[] = [];
	payment: any = { date: "", transactioncode: "", methodtype: "", commision: "", amount: "", description: "" };
	listAssignment: any[] = [];
	assignment: any = { name: "", date: "", typeid: "", amount: "", description: "" };
	listPassenger: any[] = [];
	passenger: any = { id: "", typeid: "", amount: "", description: "", isEdit: false };
	listAdditionalService: any[] = [];
	additionalservice: any = { id: "", touradditionalserviceid: "", quantity: "", amount: "", description: "", isEdit: false };
	listHotel: any[] = [];
	hotel: any = {  hoteltypeid: "", roomtypeid: "", tourhotelid: "", quantity: "", price: "", description: "", hotelid: "", servicemodeid: "", checkin: "", checkout: "", hotelnight: 0 };
	listItinerary: any[] = [];
	itinerary: any = { id: "", name: "", description: "", observation: "", isEdit: false };
	
	entityname: string = "";

	_pathservice: string = "booking";
	_entityname: string = "reserva";
	_pathurl: string = "/sale/bookings";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private _commonService: CommonService, 
		private _matDialog: MatDialog) { 

	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			var isok = false;
			var paths = this.router.url.split("/");			

			if (paths.length == 5 && paths[3] == "edit")
				isok = this.setData(paths[4], null);

			if (!(isok)) {
				Swal.fire({ icon: 'error', title: 'Error', text: `Información no válida del ${ this._entityname }` })

				this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
			}

			this.getOptionList();
			this.getRole();

			if (this._IsEdit) {
				this.getServiceIncludedList(this.id);
				this.getServiceNotIncludedList(this.id);
				this.getPaymentList(this.id);
				this.getPassengerList(this.id);
				this.getAssignmentList(this.id);
				this.getAdditionalServiceList(this.id);
				this.getHotelList(this.id);
				this.getItineraryList(this.id);
			}
		});
	}

	ngOnDestroy() {
		
	}

	getRole() {
		var obj = JSON.parse(localStorage.getItem('infoauth'));
		
		if (obj.role.name == "Admin")
			this.role = 0;

		if (obj.role.name == "User")
			this.role = 1;
	}	

	openModalCreateNotification(): void {
		const dialogRef = this._matDialog.open(CreateNotificationComponent, { width: '45em', height: '32em', data: { bookingid: this.id } });

		dialogRef.afterClosed().subscribe(result => {
			
		});
	}

	openModalUpdateDate(): void {
		const dialogRef = this._matDialog.open(UpdateDateComponent, { width: '45em', height: '32em', data: { bookingid: this.id } });

		dialogRef.afterClosed().subscribe(result => {
			this.refresh();

			setTimeout(() => { this._serviceincludedname.nativeElement.focus(); }, 500);

			this.layoutUtilsService.showActionNotification(`Se ha actualizado la ${ this._entityname } con éxito`, MessageType.Update);
		});
	}

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/TypeAssignment`).subscribe((result: any[]) => {
			this.listTypeAssignment = result;
			
			this.listTypeAssignment.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});
		
		this._commonService.List(`optionlist/listbykey/TipoCliente`).subscribe((result: any[]) => {
			this.listCustomerType = result;
			
			this.listCustomerType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/TipoHabitacion`).subscribe((result: any[]) => {
			this.listRoomType = result;
			
			this.listRoomType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/TipoHotel`).subscribe((result: any[]) => {
			this.listHotelType = result;
			
			this.listHotelType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/ModoServicio`).subscribe((result: any[]) => {
			this.lstServiceMode = result;
			
			this.lstServiceMode.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`hotel/list`).subscribe((result: any[]) => {
			this.lstHotel = result;
			
			this.lstHotel.unshift({ value: "", label: "-- seleccione una opción --", status: true });
		});
	}

	reset() {
		this.id = "";
		this.name = "";
		this.description = "";

		this._IsCreate = true;
	}

	setData(id: string, resultrefresh: any = null) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));

		if (resultrefresh != null) {
			result = resultrefresh;
			localStorage.setItem(`${ this._pathservice }-${ id}`, JSON.stringify(result));
		}

		if (result == null)
			return false;
		
		this.id = id;
		this.name = result.name;
		this.tourid = result.tourid;
		this.tourname = result.tourname;
		this.tourtypename = result.tourtypename;
		this.categoryname = result.categoryname;
		this.startdate = this.ConvertDate(result.startdate, false);
		this.enddate = this.ConvertDate(result.enddate, false);
		this.passengers = result.passengers;
		this.adultpassengers = result.adultpassengers;
		this.studentpassengers = result.studentpassengers;
		this.childrenpassengers = result.childrenpassengers;
		this.adultprice = result.adultprice;
		this.studentprice = result.studentprice;
		this.childrenprice = result.childrenprice;
		this.babypassengers = result.babypassengers;
		this.contactname = result.contactname;
		this.contactemail = result.contactemail;
		this.createdname = result.createdbyname;
		this.amount = result.amount;
		this.debt = result.debt;
		this.ispackage = result.ispackage;
		this.hotelnight = result.hotelnight;
		this.observation = result.observation;
		this.description = result.description;
		
		this.changedate = result.changedate;
		this.changepassenger = result.changepassenger;
		this.changeadditionalservice = result.changeadditionalservice;
		this.changehotel = result.changehotel;

		if (resultrefresh == null) {
			this._commonService.List(`tour/${ this.tourid }/additionalservice/list`).subscribe((result: any[]) => {
				this.listTourAdditionalService = result;
				
				this.listTourAdditionalService.unshift({ id: "", additionalserviceparentname: "", additionalserviceid: "", additionalservicename: "-- seleccione una opción --", price: 0 });
			});
		}

		if (this.ispackage) {
			if (resultrefresh == null) {
				this._commonService.List(`tour/${ this.tourid }/hotel/list`).subscribe((result: any[]) => {
					this.listTourHotel = result;
				});
			}
		}
		
		this.entityname = `${ result.tourname }: ${ result.contactname }`;

		this._IsEdit = true;

		return true;
	}

	validate() {
		let value = false;
/*
		if ((this.name == "") || (this.name == undefined) || (this.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return value;
		}
		*/
		return true;
	}

	save() {
		if (this.validate()) {
			let data: any = {};
			let url: string = "";
/*
			if (this.id == "") {
				url = `${ this._pathservice }/create`;

				data.name = this.name;
				data.description = this.description;

				this._commonService.Create(url, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Creado', text: `La ${ this._entityname } se creo con éxito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}
*/
			if (this.id != "") {
				url = `${ this._pathservice }/update`;

				data.id = this.id;
				data.description = this.description;
				data.observation = this.observation;
				data.operation = null;

				this._commonService.Update(url, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Actualizado', text: `La ${ this._entityname } se actualizo con exito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}
		}
	}

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Editar ${ this._entityname }: ${ this.entityname }`;
	}

	refresh() {
		this._commonService.Get(`${ this._pathservice }/${ this.id }`).subscribe((result: any) => {
			this.setData(this.id, result);
		});
	}

	setChangeAction(action: number) {
		var data = { action: action };

		this._commonService.Update(`${ this._pathservice }/${ this.id }/changeaction`, data).subscribe((result: any) => {
			if (result) {
				this.refresh();
				
				setTimeout(() => { this._serviceincludedname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`Se ha actualizado la ${ this._entityname } con éxito`, MessageType.Update);
			}
		});
	}

	// Service included
	setServiceIncludedClear() {
		this.serviceincluded.isEdit = false;
		this.serviceincluded.id = "";
		this.serviceincluded.name = "";
		this.serviceincluded.description = "";
	}

	setServiceIncludedEdit(id: string, name: string, description: string) {
		this.serviceincluded.isEdit = true;
		this.serviceincluded.id = id;
		this.serviceincluded.name = name;
		this.serviceincluded.description = description;
	}

	getServiceIncludedList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/serviceincluded/list`).subscribe((result: any[]) => {
			this.listServiceIncluded = result;
		});
	}

	setServiceIncludedCreate() {
		if ((this.serviceincluded.name == "") || (this.serviceincluded.name == undefined) || (this.serviceincluded.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		var data = { bookingid: this.id, name: this.serviceincluded.name, description: this.serviceincluded.description };

		this._commonService.Create(`${ this._pathservice }/serviceincluded/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setServiceIncludedClear();
				this.getServiceIncludedList(this.id);

				setTimeout(() => { this._serviceincludedname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El servicio incluído del ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setServiceIncludedUpdate() {
		//if ((this.serviceincluded.description == "") || (this.serviceincluded.description == undefined) || (this.serviceincluded.description == null)) {
		//	Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (DESCRIPCIÓN) es obligatorio" });
		//	
		//	return;
		//}

		var data = { id: this.serviceincluded.id, description: this.serviceincluded.description };

		this._commonService.Update(`${ this._pathservice }/serviceincluded/edit`, data).subscribe((result: any) => {
			if (result) {						
				this.setServiceIncludedClear();
				this.getServiceIncludedList(this.id);

				setTimeout(() => { this._serviceincludedname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El servicio incluído de la ${ this._entityname } se actualizo con éxito`, MessageType.Update);
			}
		});
	}

	setServiceIncludedDelete(id: string, name: string) {
		let _entityname = 'El servicio incluído de la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/serviceincluded/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getServiceIncludedList(this.id);

					setTimeout(() => { this._serviceincludedname.nativeElement.focus(); }, 500);

					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	// Service not included
	setServiceNotIncludedClear() {
		this.servicenotincluded.isEdit = false;
		this.servicenotincluded.id = "";
		this.servicenotincluded.name = "";
		this.servicenotincluded.description = "";
	}

	setServiceNotIncludedEdit(id: string, name: string, description: string) {
		this.servicenotincluded.isEdit = true;
		this.servicenotincluded.id = id;
		this.servicenotincluded.name = name;
		this.servicenotincluded.description = description;
	}

	getServiceNotIncludedList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/servicenotincluded/list`).subscribe((result: any[]) => {
			this.listServiceNotIncluded = result;
		});
	}

	setServiceNotIncludedCreate() {
		if ((this.servicenotincluded.name == "") || (this.servicenotincluded.name == undefined) || (this.servicenotincluded.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		var data = { bookingid: this.id, name: this.servicenotincluded.name, description: this.servicenotincluded.description };

		this._commonService.Create(`${ this._pathservice }/servicenotincluded/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setServiceNotIncludedClear();
				this.getServiceNotIncludedList(this.id);

				setTimeout(() => { this._servicenotincludedname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El servicio no incluído del ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setServiceNotIncludedUpdate() {
		//if ((this.serviceincluded.description == "") || (this.serviceincluded.description == undefined) || (this.serviceincluded.description == null)) {
		//	Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (DESCRIPCIÓN) es obligatorio" });
		//	
		//	return;
		//}

		var data = { id: this.servicenotincluded.id, description: this.servicenotincluded.description };

		this._commonService.Update(`${ this._pathservice }/servicenotincluded/edit`, data).subscribe((result: any) => {
			if (result) {						
				this.setServiceNotIncludedClear();
				this.getServiceNotIncludedList(this.id);

				setTimeout(() => { this._servicenotincludedname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El servicio no incluído de la ${ this._entityname } se actualizo con éxito`, MessageType.Update);
			}
		});
	}

	setServiceNotIncludedDelete(id: string, name: string) {
		let _entityname = 'El servicio no incluído de la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/servicenotincluded/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getServiceNotIncludedList(this.id);

					setTimeout(() => { this._servicenotincludedname.nativeElement.focus(); }, 500);

					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	// Payment
	setPaymentClear() {
		this.payment.date = null;
		this.payment.transactioncode = "";
		this.payment.methodtype = "";
		this.payment.commision = 0;
		this.payment.amount = 0;
		this.payment.description = "";
	}

	getPaymentList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/payment/list`).subscribe((result: any[]) => {
			this.listPayment = result;
		});
	}

	setPaymentCreate() {
		if ((this.payment.date == "") || (this.payment.date == undefined) || (this.payment.date == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (FECHA) es obligatorio" });
			
			return;
		}

		if ((this.payment.transactioncode == "") || (this.payment.transactioncode == undefined) || (this.payment.transactioncode == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CÓDIGO DE TRANSACCIÓN) es obligatorio" });
			
			return;
		}

		if ((this.payment.methodtype == "") || (this.payment.methodtype == undefined) || (this.payment.methodtype == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE PAGO) es obligatorio" });
			
			return;
		}

		if ((this.payment.commision == "") || (this.payment.commision == undefined) || (this.payment.commision == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (COMISIÓN) es obligatorio" });
			
			return;
		}

		if ((this.payment.amount == "") || (this.payment.amount == undefined) || (this.payment.amount == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MONTO) es obligatorio" });
			
			return;
		}

		var data = { bookingid: this.id, date: this.payment.date, transactioncode: this.payment.transactioncode, methodtype: this.payment.methodtype, commision: this.payment.commision, amount: this.payment.amount, description: this.payment.description };

		this._commonService.Create(`${ this._pathservice }/payment/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setPaymentClear();
				this.refresh();
				this.getPaymentList(this.id);

				setTimeout(() => { this._paymenttransactioncode.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El pago del ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setPaymentDelete(id: string, name: string) {
		let _entityname = 'El pago de la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/payment/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getPaymentList(this.id);
					this.refresh();

					setTimeout(() => { this._paymenttransactioncode.nativeElement.focus(); }, 500);

					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	// Assignment
	setAssignmentClear() {
		this.assignment.date = null;
		this.assignment.name = "";
		this.assignment.typeid = "";
		this.assignment.amount = 0;
		this.assignment.description = "";
	}

	getAssignmentList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/assignment/list`).subscribe((result: any[]) => {
			this.listAssignment = result;
		});
	}

	setAssignmentCreate() {
		if ((this.assignment.name == "") || (this.assignment.name == undefined) || (this.assignment.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		if ((this.assignment.date == "") || (this.assignment.date == undefined) || (this.assignment.date == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (FECHA) es obligatorio" });
			
			return;
		}

		if ((this.assignment.typeid == "") || (this.assignment.typeid == undefined) || (this.assignment.typeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE ASIGNACION) es obligatorio" });
			
			return;
		}

		if ((this.assignment.amount == "") || (this.assignment.amount == undefined) || (this.assignment.amount == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MONTO) es obligatorio" });
			
			return;
		}

		var data = { bookingid: this.id, date: this.assignment.date, name: this.assignment.name, typeid: this.assignment.typeid, amount: this.assignment.amount, description: this.assignment.description };

		this._commonService.Create(`${ this._pathservice }/assignment/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setAssignmentClear();
				this.getAssignmentList(this.id);
				this.refresh();

				setTimeout(() => { this._assignmentname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`La variación de precio en la ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setAssignmentDelete(id: string, name: string) {
		let _entityname = 'La variación de precio en la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/assignment/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getAssignmentList(this.id);
					this.refresh();
	
					setTimeout(() => { this._assignmentname.nativeElement.focus(); }, 500);
				}
			});
		});
	}

	// Passenger
	setPassengerClear() {
		this.passenger.isEdit = false;
		this.passenger.typeid = "";
		this.passenger.amount = 0;
		this.passenger.description = "";
	}

	setPassengerEdit(id: string, typeid: string, amount: number, description: string) {
		this.passenger.isEdit = true;
		this.passenger.id = id;
		this.passenger.typeid = typeid;
		this.passenger.amount = amount;
		this.passenger.description = description;

		//if (this.changepassenger)
		//	this.passenger.isEdit = false;
	}

	getPassengerList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/passenger/list`).subscribe((result: any[]) => {
			this.listPassenger = result;
		});
	}

	setPassengerCreate() {
		if ((this.passenger.typeid == "") || (this.passenger.typeid == undefined) || (this.passenger.typeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE CLIENTE) es obligatorio" });
			
			return;
		}

		if ((this.passenger.amount == "") || (this.passenger.amount == undefined) || (this.passenger.amount == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MONTO) es obligatorio" });
			
			return;
		}

		var data = { bookingid: this.id, typeid: this.passenger.typeid, amount: this.passenger.amount, description: this.passenger.description };

		this._commonService.Create(`${ this._pathservice }/passenger/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setPassengerClear();
				this.getPassengerList(this.id);
				this.refresh();

				setTimeout(() => { this._passengeramount.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El pasajero de la ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setPassengerUpdate() {
		var data = { id: this.passenger.id, amount: (this.changepassenger ? this.passenger.amount : 0), description: this.passenger.description };

		this._commonService.Update(`${ this._pathservice }/passenger/edit`, data).subscribe((result: any) => {
			if (result) {						
				this.setPassengerClear();
				this.getPassengerList(this.id);

				setTimeout(() => { this._passengeramount.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El pasajero de la ${ this._entityname } se actualizo con éxito`, MessageType.Update);
			}
		});
	}

	setPassengerDelete(id: string, name: string) {
		let _entityname = 'El pasajero de la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/passenger/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getPassengerList(this.id);
					this.refresh();

					setTimeout(() => { this._passengeramount.nativeElement.focus(); }, 500);

					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	// Additional Service
	setAdditionalServiceClear() {
		this.additionalservice.isEdit = false;
		this.additionalservice.id = "";
		this.additionalservice.touradditionalserviceid = "";
		this.additionalservice.quantity = 0;
		this.additionalservice.amount = 0;
		this.additionalservice.description = "";
	}

	getAdditionalServiceList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/additionalservice/list`).subscribe((result: any[]) => {
			this.listAdditionalService = result;
		});
	}

	setAdditionalServiceEdit(id: string, touradditionalserviceid: string, quantity: number, amount: number, description: string) {
		this.additionalservice.isEdit = true;
		this.additionalservice.id = id;
		this.additionalservice.touradditionalserviceid = touradditionalserviceid;
		this.additionalservice.quantity = quantity;
		this.additionalservice.amount = amount;
		this.additionalservice.description = description;
	}

	setAdditionalServiceCreate() {
		if ((this.additionalservice.touradditionalserviceid == "") || (this.additionalservice.touradditionalserviceid == undefined) || (this.additionalservice.touradditionalserviceid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SERVICIO ADICIONAL) es obligatorio" });
			
			return;
		}

		if ((this.additionalservice.quantity == "") || (this.additionalservice.quantity == undefined) || (this.additionalservice.quantity == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CANTIDAD) es obligatorio" });
			
			return;
		}

		if ((this.additionalservice.amount == "") || (this.additionalservice.amount == undefined) || (this.additionalservice.amount == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MONTO) es obligatorio" });
			
			return;
		}

		var data = { bookingid: this.id, touradditionalserviceid: this.additionalservice.touradditionalserviceid, quantity: this.additionalservice.quantity, amountunit: this.additionalservice.amount, description: this.additionalservice.description };

		this._commonService.Create(`${ this._pathservice }/additionalservice/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setAdditionalServiceClear();				
				this.getAdditionalServiceList(this.id);
				this.refresh();

				setTimeout(() => { this._additionalservicequantity.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El servicio adicional de la ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setAdditionalServiceUpdate() {
		if ((this.additionalservice.quantity == "") || (this.additionalservice.quantity == undefined) || (this.additionalservice.quantity == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CANTIDAD) es obligatorio" });
			
			return;
		}

		if ((this.additionalservice.amount == "") || (this.additionalservice.amount == undefined) || (this.additionalservice.amount == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MONTO) es obligatorio" });
			
			return;
		}
/*
		if ((this.additionalservice.description == "") || (this.additionalservice.description == undefined) || (this.additionalservice.description == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (DESCRIPCIÓN) es obligatorio" });
			
			return;
		}
*/
		var data = { id: this.additionalservice.id, quantity: this.additionalservice.quantity, amountunit: this.additionalservice.amount, description: this.additionalservice.description };

		this._commonService.Create(`${ this._pathservice }/additionalservice/edit`, data).subscribe((result: any) => {
			if (result) {						
				this.setAdditionalServiceClear();
				this.getAdditionalServiceList(this.id);
				this.refresh();

				setTimeout(() => { this._additionalservicequantity.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El servicio adicional de la ${ this._entityname } se actualizo con éxito`, MessageType.Update);
			}
		});
	}

	setAdditionalServiceDelete(id: string, name: string) {
		let _entityname = 'El servicio adicional de la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/additionalservice/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getAdditionalServiceList(this.id);
					this.refresh();

					setTimeout(() => { this._additionalservicequantity.nativeElement.focus(); }, 500);

					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	// Hotel
	setHotelClear() {
		this.hotel.tourhotelid = "";
		this.hotel.quantity = 0;
		this.hotel.price = 0;
		this.hotel.description = "";
	}

	getHotelList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/hotel/list`).subscribe((result: any[]) => {
			this.listHotel = result;
		});
	}

	setHotelCreate() {
		if ((this.hotel.hoteltypeid == "") || (this.hotel.hoteltypeid == undefined) || (this.hotel.hoteltypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE HOTEL) es obligatorio" });
			
			return;
		}

		if ((this.hotel.roomtypeid == "") || (this.hotel.roomtypeid == undefined) || (this.hotel.roomtypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE HABITACIÓN) es obligatorio" });
			
			return;
		}

		let item = this.listTourHotel.filter(m => m.roomtypeid == this.hotel.roomtypeid && m.hoteltypeid == this.hotel.hoteltypeid);

		if (!(item.length > 0)) {
			Swal.fire({ icon: 'warning', title: 'HOTEL', text: "No existe el tipo de hotel y habitación en la configuración del tour" });
			
			return;
		}

		if ((this.hotel.quantity == "") || (this.hotel.quantity == undefined) || (this.hotel.quantity == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CANTIDAD) es obligatorio" });
			
			return;
		}

		if ((this.hotel.price == "") || (this.hotel.price == undefined) || (this.hotel.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return;
		}

		if ((this.hotel.hotelid == "") || (this.hotel.hotelid == undefined) || (this.hotel.hotelid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (HOTEL) es obligatorio" });
			
			return;
		}

		if ((this.hotel.servicemodeid == "") || (this.hotel.servicemodeid == undefined) || (this.hotel.servicemodeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MODO DE SERVICIO) es obligatorio" });
			
			return;
		}

		if ((this.hotel.checkin == "") || (this.hotel.checkin == undefined) || (this.hotel.checkin == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (INGRESO) es obligatorio" });
			
			return;
		}

		if ((this.hotel.checkout == "") || (this.hotel.checkout == undefined) || (this.hotel.checkout == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SALIDA) es obligatorio" });
			
			return;
		}

		if ((this.hotel.hotelnight == "") || (this.hotel.hotelnight == undefined) || (this.hotel.hotelnight == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOCHES) es obligatorio" });
			
			return;
		}

		var data = { 
			bookingid: this.id, 
			tourhotelid: item[0].id, 
			quantity: this.hotel.quantity, 
			price: this.hotel.price, 
			description: this.hotel.description,
			hotelid: this.hotel.hotelid, 
			servicemodeid: this.hotel.servicemodeid,
			checkin: this.hotel.checkout,
			checkout: this.hotel.checkin,
			hotelnight: this.hotel.hotelnight,
		};

		this._commonService.Create(`${ this._pathservice }/hotel/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setHotelClear();				
				this.getHotelList(this.id);
				this.refresh();

				setTimeout(() => { this._hotelquantity.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El hotel de la ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setHotelDelete(id: string, name: string) {
		let _entityname = 'El hotel de la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/hotel/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getHotelList(this.id);
					this.refresh();

					setTimeout(() => { this._hotelquantity.nativeElement.focus(); }, 500);
					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	// Itinerario
	setItineraryClear() {
		this.itinerary.id = "";
		this.itinerary.name = "";
		this.itinerary.description = "";
		this.itinerary.observation = "";
	}

	getItineraryList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/itinerary/list`).subscribe((result: any[]) => {
			this.listItinerary = result;
		});
	}

	setItineraryEdit(id: string, name: string, description: string, observation: string) {
		this.itinerary.isEdit = true;
		this.itinerary.id = id;
		this.itinerary.name = name;
		this.itinerary.description = description;
		this.itinerary.observation = observation;
	}
/*
	setHotelCreate() {
		if ((this.hotel.hoteltypeid == "") || (this.hotel.hoteltypeid == undefined) || (this.hotel.hoteltypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE HOTEL) es obligatorio" });
			
			return;
		}

		if ((this.hotel.roomtypeid == "") || (this.hotel.roomtypeid == undefined) || (this.hotel.roomtypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE HABITACIÓN) es obligatorio" });
			
			return;
		}

		let item = this.listTourHotel.filter(m => m.roomtypeid == this.hotel.roomtypeid && m.hoteltypeid == this.hotel.hoteltypeid);

		if (!(item.length > 0)) {
			Swal.fire({ icon: 'warning', title: 'HOTEL', text: "No existe el tipo de hotel y habitación en la configuración del tour" });
			
			return;
		}

		if ((this.hotel.quantity == "") || (this.hotel.quantity == undefined) || (this.hotel.quantity == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CANTIDAD) es obligatorio" });
			
			return;
		}

		if ((this.hotel.price == "") || (this.hotel.price == undefined) || (this.hotel.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return;
		}

		if ((this.hotel.hotelid == "") || (this.hotel.hotelid == undefined) || (this.hotel.hotelid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (HOTEL) es obligatorio" });
			
			return;
		}

		if ((this.hotel.servicemodeid == "") || (this.hotel.servicemodeid == undefined) || (this.hotel.servicemodeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MODO DE SERVICIO) es obligatorio" });
			
			return;
		}

		if ((this.hotel.checkin == "") || (this.hotel.checkin == undefined) || (this.hotel.checkin == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (INGRESO) es obligatorio" });
			
			return;
		}

		if ((this.hotel.checkout == "") || (this.hotel.checkout == undefined) || (this.hotel.checkout == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SALIDA) es obligatorio" });
			
			return;
		}

		if ((this.hotel.hotelnight == "") || (this.hotel.hotelnight == undefined) || (this.hotel.hotelnight == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOCHES) es obligatorio" });
			
			return;
		}

		var data = { 
			bookingid: this.id, 
			tourhotelid: item[0].id, 
			quantity: this.hotel.quantity, 
			price: this.hotel.price, 
			description: this.hotel.description,
			hotelid: this.hotel.hotelid, 
			servicemodeid: this.hotel.servicemodeid,
			checkin: this.hotel.checkout,
			checkout: this.hotel.checkin,
			hotelnight: this.hotel.hotelnight,
		};

		this._commonService.Create(`${ this._pathservice }/hotel/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setHotelClear();				
				this.getHotelList(this.id);
				this.refresh();

				setTimeout(() => { this._hotelquantity.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El hotel de la ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}*/

	setItineraryUpdate() {
		if ((this.itinerary.observation == "") || (this.itinerary.observation == undefined) || (this.itinerary.observation == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (OBSERVACION) es obligatorio" });
			
			return;
		}

		var data = { observation: this.itinerary.observation };

		this._commonService.Update(`${ this._pathservice }/itinerary/${ this.itinerary.id }/edit`, data).subscribe((result: any) => {
			if (result) {						
				this.setItineraryClear();
				this.getItineraryList(this.id);
				this.refresh();

				setTimeout(() => { this._itineraryname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El itinerario de la ${ this._entityname } se actualizo con éxito`, MessageType.Update);
			}
		});
	}

	setItineraryDelete(id: string, name: string) {
		let _entityname = 'El itinerario de la reserva';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/itinerary/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getItineraryList(this.id);
					this.refresh();

					setTimeout(() => { this._itineraryname.nativeElement.focus(); }, 500);
					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	onChangeAdditionalService(event: any): void {    
		let item: any = this.listTourAdditionalService.filter(m => m.id == event.value);

		this.additionalservice.amount = 0.0;
	
		if (item.length > 0)
			this.additionalservice.amount = item[0].price;
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
