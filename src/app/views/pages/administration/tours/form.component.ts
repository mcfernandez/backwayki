// Angular
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';

// RxJS
import { Observable } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

import { Authorization } from 'src/app/app.utility';

@Component({
	selector: 'kt-form',
	templateUrl: './form.component.html',
})

export class TourFormComponent implements OnInit, OnDestroy {
	@ViewChild('_linkname', { static: false }) _linkname: ElementRef;
	@ViewChild('_serviceincludedname', { static: false }) _serviceincludedname: ElementRef;
	@ViewChild('_pricequantity', { static: false }) _pricequantity: ElementRef;
	@ViewChild('_additionalserviceprice', { static: false }) _additionalserviceprice: ElementRef;
	@ViewChild('_hotelprice', { static: false }) _hotelprice: ElementRef;
	@ViewChild('_servicenotincludedname', { static: false }) _servicenotincludedname: ElementRef;
	@ViewChild('_itineraryname', { static: false }) _itineraryname: ElementRef;
	@ViewChild('_equipmenttooldescription', { static: false }) _equipmenttooldescription: ElementRef;
	@ViewChild('_equipmentfooddescription', { static: false }) _equipmentfooddescription: ElementRef;

	loading$: Observable<boolean>;
	
	selectedTab: number = 0;

	id: string = "";
	code: string = "";
	name: string = "";
	typeid: string = "";
    categoryid: string = "";
	duration: number = 0;
	hotelnight?: number = null;
	description: string = "";

	isPackage: boolean = false;
	isShowAdditionalServiceChild: boolean = false;

	link: any = { name: "", link: "", description: "" };
	serviceincluded: any = { name: "", description: "" };
	price: any = { id: "", tourtypeid: "", categoryid: "", customertypeid: "", quantity: 0, price: 0.0, description: "", isedit: false };
	additionalservice: any = { additionalserviceparentid: "", additionalserviceid: "", price: 0.0, description: "" };
	hotel: any = { id: "", hoteltypeid: "", roomtypeid: "", price: 0.0, description: "", isedit: false };
	servicenotincluded: any = { name: "", description: "" };
	itinerary: any = { name: "", observation: "", description: "" };
	equipmenttool: any = { name: "", categoryid: "", subcategoryid: "", quantity: 0, description: "" };
	equipmentfood: any = { name: "", categoryid: "", subcategoryid: "", quantity: 0, description: "" };

	entityname: string = "";

	_pathservice: string = "tour";
	_entityname: string = "tour";
	_pathurl: string = "/administration/tours";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;
	_IsRead: boolean = false;

	listType: any[] = [];
	listCategory: any[] = [];
	listPriceType: any[] = [];
	listCategoryPrice: any[] = [];
	listCustomerType: any[] = [];
	listAdditionalService: any[] = [];
	listAdditionalServiceChild: any[] = [];
	listHotelType: any[] = [];
	listRoomType: any[] = [];
	listEquipmentCategory: any[] = [];
	listEquipmentToolCategory: any[] = [];
	listEquipmentToolSubCategory: any[] = [];
	listEquipmentFoodCategory: any[] = [];
	listEquipmentFoodSubCategory: any[] = [];
	listEquipmentType: any[] = [];

	listCorporateClient: any[] = [];
	corporateclientid: string = "bdeafdf7-3472-40f9-b59b-e76d4601b852";

	listTourLink: any[] = [];
	listTourServiceIncluded: any[] = [];
	listTourPrice: any[] = [];
	listTourAdditionalService: any[] = [];
	listTourHotel: any[] = [];
	listTourServiceIncludedFilter: any[] = [];
	listTourPriceFilter: any[] = [];
	listTourAdditionalServiceFilter: any[] = [];
	listTourHotelFilter: any[] = [];
	listTourEquipment: any[] = [];
	listTourEquipmentTool: any[] = [];
	listTourEquipmentFood: any[] = [];

	listTourItinerary: any[] = [];
	listTourServiceNotIncluded: any[] = [];
	listTourItineraryFilter: any[] = [];
	listTourServiceNotIncludedFilter: any[] = [];

	permission: any[] = [];

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private layoutUtilsService: LayoutUtilsService,
		        private _commonService: CommonService) { 

	}

	ngOnInit() {
		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 1, "administracion", "tour");

		this.activatedRoute.params.subscribe(params => {
			var isok = false;
			var paths = this.router.url.split("/");			

			if (paths.length == 5 && paths[3] == "edit")
				isok = this.setData(paths[4]);

			if (paths.length == 4 && paths[3] == "create") {
				this.reset();

				isok = true;
			}

			if (!(isok)) {
				Swal.fire({ icon: 'error', title: 'Error', text: `Información no válida del ${ this._entityname }` })

				this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
			}

			this.getOptionList();

			if (this._IsEdit) {
				this.getLinkList(this.id);
				this.getServiceIncludedList(this.id);
				this.getPriceList(this.id);
				this.getAdditionalServiceList(this.id);
				this.getHotelList(this.id);
				this.getItineraryList(this.id);
				this.getServiceNotIncludedList(this.id);
				this.getEquipmentList(this.id, "");

				let read = Authorization.Action(1, this.permission);
				let update = Authorization.Action(2, this.permission);

				if (!(update))
					this._IsRead = read;
			}
		});
	}

	ngOnDestroy() {
		
	}

	reset() {
		this.id = "";
		this.code = "";
		this.name = "";
		this.typeid = "";
		this.categoryid = "";
		this.duration = 0;
		this.description = "";

		this.isPackage = false;

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)			
			return false;

		this.id = id;
		this.code = result.code;
		this.name = result.name;
		this.typeid = result.typeid;
		this.categoryid = result.categoryid;
		this.duration = result.duration;
		this.hotelnight = result.hotelnight;
		this.description = result.description;

		this.entityname = result.name;

		if (this.typeid == "83945e7f-7b92-eb11-ab1b-40ec994df7b4")
			this.isPackage = true;

		this._IsEdit = true;

		return true;
	}

	validate() {
		let value = false;
		let isNew = this.id == "";

		if (isNew) {
			if ((this.code == "") || (this.code == undefined) || (this.code == null)) {
				Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CÓDIGO) es obligatorio" });
				
				return value;
			}
		}

		if ((this.name == "") || (this.name == undefined) || (this.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return value;
		}

		if (isNew) {
			if ((this.typeid == "") || (this.typeid == undefined) || (this.typeid == null)) {
				Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO) es obligatorio" });
				
				return value;
			}
		
			if ((this.categoryid == "") || (this.categoryid == undefined) || (this.categoryid == null)) {
				Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CATEGORÍA) es obligatorio" });
				
				return value;
			}
		}

		if ((this.duration < 0) || (this.duration == undefined) || (this.duration == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (DURACIÓN) es obligatorio y debe ser mayor a 0 (cero)" });
			
			return value;
		}
		
		return true;
	}

	save() {
		if (this.validate()) {
			let data: any = {};
			let url: string = "";

			if (this.id == "") {
				url = `${ this._pathservice }/create`;

				data.code = this.code;
				data.name = this.name;
				data.typeid = this.typeid;
				data.categoryid = this.categoryid;
				data.duration = this.duration;

				if (data.typeid == "83945e7f-7b92-eb11-ab1b-40ec994df7b4")
					data.hotelnight = this.hotelnight;
				else
					data.hotelnight = null;
				
				data.description = this.description;

				this._commonService.Create(url, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Creado', text: `El ${ this._entityname } se creo con éxito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}

			if (this.id != "") {
				url = `${ this._pathservice }/update`;

				data.id = this.id;
				data.code = this.code;
				data.name = this.name;
				data.duration = this.duration;
				data.description = this.description;

				this._commonService.Update(url, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Actualizado', text: `El ${ this._entityname } se actualizo con exito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}
		}
	}

	duplicate() {
		if (this.id != "") {
			if ((this.corporateclientid == "") || (this.corporateclientid == undefined) || (this.corporateclientid == null)) {
				Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CLIENTE CORPORATIVO) es obligatorio" });
				
				return;
			}

			var url = `${ this._pathservice }/duplicatecorporateclient`;
			var data = { id: this.id, corporateclientid: this.corporateclientid };

			this._commonService.Create(url, data).subscribe((result: any) => {
				if (result) {	
					this.getItineraryList(this.id);
					this.getServiceIncludedList(this.id);
					this.getServiceNotIncludedList(this.id);
					this.getPriceList(this.id);
					this.getAdditionalServiceList(this.id);
					this.getHotelList(this.id);

					Swal.fire({ icon: 'success', title: 'Actualizado', text: `Se ha actualizado la información con exito` })
				}
			});
		}
	}

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Editar ${ this._entityname }: ${ this.entityname }`;
	}

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/TipoTour`).subscribe((result: any[]) => {
			this.listType = result;
			
			this.listType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/CategoriaTour`).subscribe((result: any[]) => {
			this.listCategory = result;
			
			this.listCategory.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		if (this._IsEdit) {
			this._commonService.List(`optionlist/listbykey/CategoriaPrecio`).subscribe((result: any[]) => {
				this.listPriceType = result;
				
				this.listPriceType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
			});
	
			this._commonService.List(`optionlist/listbykey/ModalidadTour`).subscribe((result: any[]) => {
				this.listCategoryPrice = result;
				
				this.listCategoryPrice.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
			});
	
			this._commonService.List(`optionlist/listbykey/TipoCliente`).subscribe((result: any[]) => {
				this.listCustomerType = result;
				
				this.listCustomerType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
			});
	
			this._commonService.List(`additionalservice/listfull`).subscribe((result: any[]) => {
				this.listAdditionalService = result;
				
				this.listAdditionalService.unshift({ id: "", name: "-- seleccione una opción --", price: 0, status: true, childs: [] });
			});
	
			this._commonService.List(`optionlist/listbykey/TipoHotel`).subscribe((result: any[]) => {
				this.listHotelType = result;
				
				this.listHotelType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
			});
	
			this._commonService.List(`optionlist/listbykey/TipoHabitacion`).subscribe((result: any[]) => {
				this.listRoomType = result;
				
				this.listRoomType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
			});

			this._commonService.List(`optionlist/listbykey/CategoriaPrecio`).subscribe((result: any[]) => {
				this.listPriceType = result;
				
				this.listPriceType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
			});
			
			this._commonService.List(`corporateclient/list`).subscribe((result: any[]) => {
				this.listCorporateClient = result;
			});

			this._commonService.List(`optionlist/listbykey/TipoEquipo`).subscribe((result: any[]) => {
				this.listEquipmentType = result;
							
				this._commonService.List(`equipmentcategory/list`).subscribe((result: any[]) => {
					this.listEquipmentCategory = result;

					var tool = this.listEquipmentType.filter(m => m.code == "Equipo");
					var food = this.listEquipmentType.filter(m => m.code == "Alimento");
		
					this.listEquipmentToolCategory = result.filter(m => m.typeid == tool[0].id);
					this.listEquipmentFoodCategory = result.filter(m => m.typeid == food[0].id);

					this.listEquipmentToolCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
					this.listEquipmentFoodCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
	
					this.listEquipmentToolSubCategory = [];
					this.listEquipmentToolSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
	
					this.listEquipmentFoodSubCategory = [];
					this.listEquipmentFoodSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
				});
			});
		}
	}

	onChangeTipo(event: any) {
		this.isPackage = false;

		if (event.value == "83945e7f-7b92-eb11-ab1b-40ec994df7b4")
			this.isPackage = true;
	}

	// Link
	setLinkClear() {
		this.link.name = "";
		this.link.link = "";
		this.link.description = "";
	}

	getLinkList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/link/list`).subscribe((result: any[]) => {
			this.listTourLink = result;

			setTimeout(() => { this._linkname.nativeElement.focus(); }, 500);
		});
	}

	setLinkCreate() {
		if ((this.link.name == "") || (this.link.name == undefined) || (this.link.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}
		
		if ((this.link.link == "") || (this.link.link == undefined) || (this.link.link == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (LINK) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, name: this.link.name, link: this.link.link, description: this.link.description };

		this._commonService.Create(`${ this._pathservice }/link/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setLinkClear();
				
				this.getLinkList(this.id);

				this.layoutUtilsService.showActionNotification(`El link del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._linkname.nativeElement.focus(); }, 500);
			}
		});
	}

	setLinkDelete(id: string, name: string) {
		let _entityname = 'El link del tour';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/link/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					this.getLinkList(this.id);
				}
			});
		});
	}

	// Service included
	setServiceIncludedClear() {
		this.serviceincluded.name = "";
		this.serviceincluded.description = "";
	}

	getServiceIncludedList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/serviceincluded/list`).subscribe((result: any[]) => {
			this.listTourServiceIncluded = result;
			this.listTourServiceIncludedFilter = this.listTourServiceIncluded.filter(m => m.corporateclientid == this.corporateclientid);

			setTimeout(() => { this._serviceincludedname.nativeElement.focus(); }, 500);
		});
	}

	setServiceIncludedCreate() {
		if ((this.corporateclientid == "") || (this.corporateclientid == undefined) || (this.corporateclientid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CLIENTE CORPORATIVO) es obligatorio" });
			
			return;
		}

		if ((this.serviceincluded.name == "") || (this.serviceincluded.name == undefined) || (this.serviceincluded.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, name: this.serviceincluded.name, description: this.serviceincluded.description, corporateclientid: this.corporateclientid };

		this._commonService.Create(`${ this._pathservice }/serviceincluded/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setServiceIncludedClear();
				
				this.getServiceIncludedList(this.id);

				this.layoutUtilsService.showActionNotification(`El servicio incluído del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._serviceincludedname.nativeElement.focus(); }, 500);
			}
		});
	}

	setServiceIncludedDelete(id: string, name: string) {
		let _entityname = 'El servicio incluído del tour';
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
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					this.getServiceIncludedList(this.id);
				}
			});
		});
	}

	// Price
	setPriceClear() {
		this.price.id = "";
		this.price.tourtypeid = "";
		this.price.categoryid = "";
		this.price.customertypeid = "";
		this.price.quantity = 0;
		this.price.price = 0.0;
		this.price.description = "";
		this.price.isedit = false;
	}	

	getPriceList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/price/list`).subscribe((result: any[]) => {
			this.listTourPrice = result;
			this.listTourPriceFilter = this.listTourPrice.filter(m => m.corporateclientid == this.corporateclientid);

			setTimeout(() => { this._pricequantity.nativeElement.focus(); }, 500);
		});
	}

	setPriceShow(id: string, tourtypeid: string, categoryid: string, customertypeid: string, quantity: number, price: number, description: string) {
		this.price.id = id;
		this.price.tourtypeid = tourtypeid;
		this.price.categoryid = categoryid;
		this.price.customertypeid = customertypeid;
		this.price.quantity = quantity;
		this.price.price = price;
		this.price.description = description;
		this.price.isedit = true;
	}

	setPriceCreate() {
		if ((this.corporateclientid == "") || (this.corporateclientid == undefined) || (this.corporateclientid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CLIENTE CORPORATIVO) es obligatorio" });
			
			return;
		}

		if ((this.price.tourtypeid == "") || (this.price.tourtypeid == undefined) || (this.price.tourtypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MODALIDAD) es obligatorio" });
			
			return;
		}

		if ((this.price.customertypeid == "") || (this.price.customertypeid == undefined) || (this.price.customertypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE CLIENTE) es obligatorio" });
			
			return;
		}
		
		if ((this.price.quantity == "") || (this.price.quantity == undefined) || (this.price.quantity == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CANTIDAD) es obligatorio" });
			
			return;
		}
		
		if ((this.price.price == "") || (this.price.price == undefined) || (this.price.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, tourtypeid: this.price.tourtypeid, categoryid: this.price.categoryid == "" ? null : this.price.categoryid, 
			         customertypeid: this.price.customertypeid, quantity: this.price.quantity, price: this.price.price, 
					 description: this.price.description, corporateclientid: this.corporateclientid };

		this._commonService.Create(`${ this._pathservice }/price/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setPriceClear();
				
				this.getPriceList(this.id);
				
				this.layoutUtilsService.showActionNotification(`El precio del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._pricequantity.nativeElement.focus(); }, 500);
			}
		});
	}

	setPriceUpdate() {
		if ((this.price.price == "") || (this.price.price == undefined) || (this.price.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return;
		}

		var data = { id: this.price.id, price: this.price.price, description: this.price.description };

		this._commonService.Update(`${ this._pathservice }/price/update`, data).subscribe((result: any) => {
			if (result) {						
				this.setPriceClear();
				
				this.getPriceList(this.id);
				
				this.layoutUtilsService.showActionNotification(`El precio del ${ this._entityname } se actualizo con éxito`, MessageType.Update);

				setTimeout(() => { this._pricequantity.nativeElement.focus(); }, 500);
			}
		});
	}

	setPriceDelete(id: string, tourtypename: string, categoryname: string, customertypename: string, quantity: number) {
		let _entityname = 'El precio del tour';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ tourtypename }, ${ categoryname }, ${ customertypename }, ${ quantity }`;
		const _waitMessage = `${ _entityname } ${ tourtypename }, ${ categoryname }, ${ customertypename }, ${ quantity } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ tourtypename }, ${ categoryname }, ${ customertypename }, ${ quantity } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/price/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					this.getPriceList(this.id);
				}
			});
		});
	}

	// Additional service
	setAdditionalServiceClear() {
		this.additionalservice.additionalserviceparentid = "";
		this.additionalservice.additionalserviceid = "";
		this.additionalservice.price = 0.0;
		this.additionalservice.description = "";
	}

	getAdditionalServiceList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/additionalservice/list`).subscribe((result: any[]) => {
			this.listTourAdditionalService = result;
			this.listTourAdditionalServiceFilter = this.listTourAdditionalService.filter(m => m.corporateclientid == this.corporateclientid);

			setTimeout(() => { this._additionalserviceprice.nativeElement.focus(); }, 500);
		});
	}

	setAdditionalServiceCreate() {
		if ((this.corporateclientid == "") || (this.corporateclientid == undefined) || (this.corporateclientid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CLIENTE CORPORATIVO) es obligatorio" });
			
			return;
		}

		if ((this.additionalservice.additionalserviceparentid == "") || (this.additionalservice.additionalserviceparentid == undefined) || (this.additionalservice.additionalserviceparentid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SERVICIO ADICIONAL) es obligatorio" });
			
			return;
		}

		let item: any = this.listAdditionalService.filter(m => m.id == this.additionalservice.additionalserviceparentid);
	
		if (item.length > 0) {
			if (item[0].childs.length > 0) {
				if ((this.additionalservice.additionalserviceid == "") || (this.additionalservice.additionalserviceid == undefined) || (this.additionalservice.additionalserviceid == null)) {
					Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (OPCION DEL SERVICIO ADICIONAL) es obligatorio" });
					
					return;
				}
			}
		}
				
		if ((this.additionalservice.price == "") || (this.additionalservice.price == undefined) || (this.additionalservice.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, additionalserviceid: this.additionalservice.additionalserviceparentid,
			         price: this.additionalservice.price, description: this.additionalservice.description, corporateclientid: this.corporateclientid };

		if (this.additionalservice.additionalserviceid != "")
			data = { tourid: this.id, additionalserviceid: this.additionalservice.additionalserviceid,
			         price: this.additionalservice.price, description: this.additionalservice.description, corporateclientid: this.corporateclientid };

		this._commonService.Create(`${ this._pathservice }/additionalservice/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setAdditionalServiceClear();
				
				this.getAdditionalServiceList(this.id);
				
				this.layoutUtilsService.showActionNotification(`El servicio adicional del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._additionalserviceprice.nativeElement.focus(); }, 500);
			}
		});
	}

	setAdditionalServiceDelete(id: string, additionalserviceparentname: string, additionalservicename: string) {
		let _entityname = 'El servicio adicional del tour';
		let _name: string = additionalservicename;

		if (additionalserviceparentname != "")
			_name = additionalserviceparentname + ": " + _name;

		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ _name }`;
		const _waitMessage = `${ _entityname } ${ _name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ _name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/additionalservice/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					this.getAdditionalServiceList(this.id);
				}
			});
		});
	}

	onChangeAdditionalService(event: any): void {    
		let item: any = this.listAdditionalService.filter(m => m.id == event.value);

		this.isShowAdditionalServiceChild = false;
		this.listAdditionalServiceChild = [];
		this.additionalservice.additionalserviceid = "";
		this.additionalservice.price = 0.0;
	
		if (item.length > 0) {
			if (item[0].childs.length > 0) {
				this.isShowAdditionalServiceChild = true;
				this.listAdditionalServiceChild = item[0].childs;
				this.listAdditionalServiceChild.unshift({ id: "", name: "-- seleccione una opción --", price: 0.0, isactive: true });
			}
			else
				this.additionalservice.price = item[0].price;
		}
	}

	onChangeAdditionalServiceChild(event: any): void {    
		let item: any = this.listAdditionalServiceChild.filter(m => m.id == event.value);

		this.additionalservice.price = 0.0;
	
		if (item.length > 0)
			this.additionalservice.price = item[0].price;
	}

	// Hotel
	setHotelClear() {
		this.hotel.id = "";
		this.hotel.hoteltypeid = "";
		this.hotel.roomtypeid = "";
		this.hotel.price = 0.0;
		this.hotel.description = "";
		this.hotel.isedit = false;
	}

	getHotelList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/hotel/list`).subscribe((result: any[]) => {
			this.listTourHotel = result;			
			this.listTourHotelFilter = this.listTourHotel.filter(m => m.corporateclientid == this.corporateclientid);
			
			setTimeout(() => { this._hotelprice.nativeElement.focus(); }, 500);
		});
	}

	setHotelShow(id: string, hoteltypeid: string, roomtypeid: string, price: number, description: string) {
		this.hotel.id = id;
		this.hotel.hoteltypeid = hoteltypeid;
		this.hotel.roomtypeid = roomtypeid;
		this.hotel.price = price;
		this.hotel.description = description;
		this.hotel.isedit = true;
	}

	setHotelCreate() {
		if ((this.corporateclientid == "") || (this.corporateclientid == undefined) || (this.corporateclientid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CLIENTE CORPORATIVO) es obligatorio" });
			
			return;
		}

		if ((this.hotel.hoteltypeid == "") || (this.hotel.hoteltypeid == undefined) || (this.hotel.hoteltypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE HOTEL) es obligatorio" });
			
			return;
		}

		if ((this.hotel.roomtypeid == "") || (this.hotel.roomtypeid == undefined) || (this.hotel.roomtypeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE HABITACIÓN) es obligatorio" });
			
			return;
		}
		
		if ((this.hotel.price == "") || (this.hotel.price == undefined) || (this.hotel.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, hoteltypeid: this.hotel.hoteltypeid, roomtypeid: this.hotel.roomtypeid, 
			         price: this.hotel.price, description: this.hotel.description, corporateclientid: this.corporateclientid };

		this._commonService.Create(`${ this._pathservice }/hotel/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setHotelClear();
				
				this.getHotelList(this.id);
				
				this.layoutUtilsService.showActionNotification(`La configuración de hotel del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._hotelprice.nativeElement.focus(); }, 500);
			}
		});
	}

	setHotelUpdate() {
		if ((this.hotel.price == "") || (this.hotel.price == undefined) || (this.hotel.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return;
		}

		var data = { id: this.hotel.id, price: this.hotel.price, description: this.hotel.description };

		this._commonService.Update(`${ this._pathservice }/hotel/update`, data).subscribe((result: any) => {
			if (result) {						
				this.setHotelClear();
				
				this.getHotelList(this.id);
				
				this.layoutUtilsService.showActionNotification(`El hotel del ${ this._entityname } se actualizo con éxito`, MessageType.Update);

				setTimeout(() => { this._hotelprice.nativeElement.focus(); }, 500);
			}
		});
	}

	setHotelDelete(id: string, hoteltypename: string, roomtypename: string) {
		let _entityname = 'La configuración de hotel del tour';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ hoteltypename }, ${ roomtypename }`;
		const _waitMessage = `${ _entityname } ${ hoteltypename }, ${ roomtypename } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ hoteltypename }, ${ roomtypename } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/hotel/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					this.getHotelList(this.id);
				}
			});
		});
	}

	// Itinerario
	setItineraryClear() {
		this.itinerary.name = "";
		this.itinerary.observation = "";
		this.itinerary.description = "";
	}

	getItineraryList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/itinerary/list`).subscribe((result: any[]) => {
			this.listTourItinerary = result;
			this.listTourItineraryFilter = this.listTourItinerary.filter(m => m.corporateclientid == this.corporateclientid);

			setTimeout(() => { this._itineraryname.nativeElement.focus(); }, 500);
		});
	}

	setItineraryCreate() {
		if ((this.corporateclientid == "") || (this.corporateclientid == undefined) || (this.corporateclientid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CLIENTE CORPORATIVO) es obligatorio" });
			
			return;
		}

		if ((this.itinerary.name == "") || (this.itinerary.name == undefined) || (this.itinerary.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}
		
		if ((this.itinerary.description == "") || (this.itinerary.description == undefined) || (this.itinerary.description == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (DESCRIPCIÓN) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, name: this.itinerary.name, observation: this.itinerary.observation, description: this.itinerary.description, corporateclientid: this.corporateclientid };

		this._commonService.Create(`${ this._pathservice }/itinerary/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setItineraryClear();
				
				this.getItineraryList(this.id);

				this.layoutUtilsService.showActionNotification(`El itinerario del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._itineraryname.nativeElement.focus(); }, 500);
			}
		});
	}

	setItineraryShow(id: string, name: string, description: string, observation: string) {
		this.itinerary.id = id;
		this.itinerary.name = name;
		this.itinerary.description = description;
		this.itinerary.observation = observation;
		this.itinerary.isedit = true;
	}

	setItineraryUpdate() {
		if ((this.itinerary.name == "") || (this.itinerary.name == undefined) || (this.itinerary.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}
		
		if ((this.itinerary.description == "") || (this.itinerary.description == undefined) || (this.itinerary.description == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (DESCRIPCIÓN) es obligatorio" });
			
			return;
		}

		var data = { id: this.itinerary.id, name: this.itinerary.name, observation: this.itinerary.observation, description: this.itinerary.description };

		this._commonService.Create(`${ this._pathservice }/itinerary/update`, data).subscribe((result: any) => {
			if (result) {						
				this.setItineraryClear();
				
				this.getItineraryList(this.id);
				
				this.layoutUtilsService.showActionNotification(`El itinerario del ${ this._entityname } se actualizo con éxito`, MessageType.Update);

				setTimeout(() => { this._itineraryname.nativeElement.focus(); }, 500);
			}
		});
	}

	setItineraryDelete(id: string, name: string) {
		let _entityname = 'El itinerario del tour';
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
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					this.getItineraryList(this.id);
				}
			});
		});
	}

	// servicio no incluido
	setServiceNotIncludedClear() {
		this.servicenotincluded.name = "";
		this.servicenotincluded.description = "";
	}

	getServiceNotIncludedList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/servicenotincluded/list`).subscribe((result: any[]) => {
			this.listTourServiceNotIncluded = result;
			this.listTourServiceNotIncludedFilter = this.listTourServiceNotIncluded.filter(m => m.corporateclientid == this.corporateclientid);

			setTimeout(() => { this._servicenotincludedname.nativeElement.focus(); }, 500);
		});
	}

	setServiceNotIncludedCreate() {
		if ((this.corporateclientid == "") || (this.corporateclientid == undefined) || (this.corporateclientid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CLIENTE CORPORATIVO) es obligatorio" });
			
			return;
		}

		if ((this.servicenotincluded.name == "") || (this.servicenotincluded.name == undefined) || (this.servicenotincluded.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, name: this.servicenotincluded.name, description: this.servicenotincluded.description, corporateclientid: this.corporateclientid };

		this._commonService.Create(`${ this._pathservice }/servicenotincluded/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setServiceNotIncludedClear();
				
				this.getServiceNotIncludedList(this.id);

				this.layoutUtilsService.showActionNotification(`El servicio no incluído del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._servicenotincludedname.nativeElement.focus(); }, 500);
			}
		});
	}

	setServiceNotIncludedDelete(id: string, name: string) {
		let _entityname = 'El servicio no incluído del tour';
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
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					this.getServiceNotIncludedList(this.id);
				}
			});
		});
	}

	SetCorporateClient() {
		this.listTourServiceIncludedFilter = this.listTourServiceIncluded.filter(m => m.corporateclientid == this.corporateclientid);
		this.listTourPriceFilter = this.listTourPrice.filter(m => m.corporateclientid == this.corporateclientid);
		this.listTourAdditionalServiceFilter = this.listTourAdditionalService.filter(m => m.corporateclientid == this.corporateclientid);
		this.listTourHotelFilter = this.listTourHotel.filter(m => m.corporateclientid == this.corporateclientid);
		this.listTourItineraryFilter = this.listTourItinerary.filter(m => m.corporateclientid == this.corporateclientid);
		this.listTourServiceNotIncludedFilter = this.listTourServiceNotIncluded.filter(m => m.corporateclientid == this.corporateclientid);
	}

	// Equipment
	setEquipmentToolClear() {
		this.equipmenttool.name = "";
		this.equipmenttool.categoryid = "";
		this.equipmenttool.subcategoryid = "";
		this.equipmenttool.quantity = "";
		this.equipmenttool.description = "";
	}

	setEquipmentFoodClear() {
		this.equipmentfood.name = "";
		this.equipmentfood.categoryid = "";
		this.equipmentfood.subcategoryid = "";
		this.equipmentfood.quantity = "";
		this.equipmentfood.description = "";
	}

	getEquipmentList(id: string, type: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/equipment/list`).subscribe((result: any[]) => {
			this.listTourEquipment = result;

			var tool = this.listEquipmentType.filter(m => m.code == "Equipo");
			var food = this.listEquipmentType.filter(m => m.code == "Alimento");

			this.listTourEquipmentTool = result.filter(m => m.typeid == tool[0].id);
			this.listTourEquipmentFood = result.filter(m => m.typeid == food[0].id);

			if (type == "tool" || type == "")
				setTimeout(() => { this._equipmenttooldescription.nativeElement.focus(); }, 500);

			if (type == "food" || type == "")
				setTimeout(() => { this._equipmentfooddescription.nativeElement.focus(); }, 500);
		});
	}

	setEquipmentToolCreate() {
		if ((this.equipmenttool.categoryid == "") || (this.equipmenttool.categoryid == undefined) || (this.equipmenttool.categoryid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CATEGORIA) es obligatorio" });
			
			return;
		}
		
		if ((this.equipmenttool.subcategoryid == "") || (this.equipmenttool.subcategoryid == undefined) || (this.equipmenttool.subcategoryid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SUB CATEGORIA) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, subcategoryid: this.equipmenttool.subcategoryid };

		this._commonService.Create(`${ this._pathservice }/equipment/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setEquipmentToolClear();
				
				this.getEquipmentList(this.id, "tool");

				this.layoutUtilsService.showActionNotification(`El equipo del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._equipmenttooldescription.nativeElement.focus(); }, 500);
			}
		});
	}

	setEquipmentFoodCreate() {
		if ((this.equipmentfood.categoryid == "") || (this.equipmentfood.categoryid == undefined) || (this.equipmentfood.categoryid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CATEGORIA) es obligatorio" });
			
			return;
		}
		
		if ((this.equipmentfood.subcategoryid == "") || (this.equipmentfood.subcategoryid == undefined) || (this.equipmentfood.subcategoryid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SUB CATEGORIA) es obligatorio" });
			
			return;
		}

		var data = { tourid: this.id, subcategoryid: this.equipmentfood.subcategoryid };

		this._commonService.Create(`${ this._pathservice }/equipment/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setEquipmentToolClear();
				
				this.getEquipmentList(this.id, "food");

				this.layoutUtilsService.showActionNotification(`El alimento del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._equipmentfooddescription.nativeElement.focus(); }, 500);
			}
		});
	}

	setEquipmentToolDelete(id: string, name: string) {
		let _entityname = 'El equipo del tour';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/equipment/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getEquipmentList(this.id, "tool");
					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					setTimeout(() => { this._equipmenttooldescription.nativeElement.focus(); }, 500);
				}
			});
		});
	}

	setEquipmentFoodDelete(id: string, name: string) {
		let _entityname = 'El alimento del tour';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/equipment/${ id }/delete`).subscribe((result: boolean) => {
				if (result) {
					this.getEquipmentList(this.id, "food");
					
					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);

					setTimeout(() => { this._equipmentfooddescription.nativeElement.focus(); }, 500);
				}
			});
		});
	}

	onChangeEquipmentToolCategory(event: any) {		
		this.listEquipmentToolSubCategory = [];
		this.listEquipmentToolSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
		this.equipmenttool.subcategoryid = "";

		if (event != null) {
			if (!((event.value == "") || (event.value == undefined) || (event.value == null))) {
				this._commonService.List(`equipmentcategory/subcategory/list/${ event.value }`).subscribe((result: any[]) => {
					this.listEquipmentToolSubCategory = result;

					this.listEquipmentToolSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
				});
			}
		}
	}

	onChangeEquipmentFoodCategory(event: any) {		
		this.listEquipmentFoodSubCategory = [];
		this.listEquipmentFoodSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
		this.equipmentfood.subcategoryid = "";

		if (event != null) {
			if (!((event.value == "") || (event.value == undefined) || (event.value == null))) {
				this._commonService.List(`equipmentcategory/subcategory/list/${ event.value }`).subscribe((result: any[]) => {
					this.listEquipmentFoodSubCategory = result;

					this.listEquipmentFoodSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
				});
			}
		}
	}

}
