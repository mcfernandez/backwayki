// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-form',
	templateUrl: './form.component.html',
})

export class NotificationFormComponent implements OnInit, OnDestroy {
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	id: string = "";
	
	bookingname: string = "";
	tourname: string = "";
	arename: string = "";	
	authorname: string = "";
	date: string = "";
	reasonname: string = "";

	items: any[] = null;
	item1: any = null;
	item2: any = null;

	name: string = "";
	description: string = "";

	entityname: string = "";

	_pathservice: string = "notification";
	_entityname: string = "notificación";
	_pathurl: string = "/sale/notifications";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;

	listAction: any[] = [];
	listReservation: any[] = [];
	listFinance: any[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _commonService: CommonService) { 

	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			var isok = false;
			var paths = this.router.url.split("/");			

			if (paths.length == 5 && paths[3] == "edit") {
				this.getOptionList();

				isok = this.setData(paths[4]);
			}

			if (paths.length == 4 && paths[3] == "create") {
				this.reset();

				isok = true;
			}

			if (!(isok)) {
				Swal.fire({ icon: 'error', title: 'Error', text: `Información no válida del ${ this._entityname }` })

				this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
			}
		});
	}

	ngOnDestroy() {
		
	}

	reset() {
		this.id = "";
		this.name = "";
		this.description = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)
			return false;
		
		this.id = id;
		
		this.bookingname = result.bookingname;
		this.tourname = result.tourname;
		this.arename = result.arename;		
		this.authorname = result.authorname;
		this.date = result.date;
		this.reasonname = result.reasonname;

		this.items = result.items;
		
		this.item1 = result.item1;
		this.item2 = result.item2;

		this.item1.asesorventa = (this.item1.userid == null && this.item1.reasonname == "Iniciado");
		this.item2.asesorventa = (this.item2.userid == null && this.item2.reasonname == "Iniciado");

		this.item1.list = false;
		this.item1.items= [];
		this.item2.list = false;
		this.item2.items= [];

		this.name = result.name;
		this.description = result.description;
		
		this.entityname = result.name;

		this._IsEdit = true;

		return true;
	}

	validate() {
		let value = false;

		if ((this.name == "") || (this.name == undefined) || (this.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return value;
		}
		
		return true;
	}

	update(id: string, type: number, status: number) {
		let data: any = {};
		let url: string = "";

		var actionid = type == 1 ? this.item1.action : this.item2.action;
		var description = type == 1 ? this.item1.response : this.item2.response;

		if (status == 1)
		{
			if ((actionid == "") || (actionid == undefined) || (actionid == null)) {
				Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "Seleccione una accion" });
				
				return;
			}
		}
		else 
			actionid = "";

		if (status == 1 || status == 3)
		{
			if ((description == "") || (description == undefined) || (description == null)) {
				Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "Ingrese la revisión" });
				
				return;
			}
		}

		if (this.id != "") {
			url = `${ this._pathservice }/${ status == 1 ? "reviewed" : (status == 3 ? "started" : "approved") }`;

			data.id = id;
			data.actionid = actionid == "" ? null : actionid;
			data.description = description;

			this._commonService.Update(url, data).subscribe((result: any) => {
				if (result) {						
					Swal.fire({ icon: 'success', title: 'Actualizado', text: `La ${ this._entityname } se actualizo con exito` })

					this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
				}
			});
		}
	}

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Procesar ${ this._entityname }: ${ this.entityname }`;
	}

	lista(type: number) {
		if (type == 1)
		{
			this.item1.list = !(this.item1.list);
			this.item1.items = this.items.filter(m => m.name == "RESERVA");
		}

		if (type == 2)
		{
			this.item2.list = !(this.item2.list);
			this.item2.items = this.items.filter(m => m.name == "CONTABILIDAD");
		}
	}

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/ActionNotification`).subscribe((result: any[]) => {
			this.listAction = result;
			
			this.listReservation = this.listAction.filter(m => m.code == "Date");
			this.listFinance = this.listAction.filter(m => m.code != "Date");
			
			this.listReservation.unshift({ id: '', code: '', name: '-- seleccione una opción --', isactive: true });
			this.listFinance.unshift({ id: '', code: '', name: '-- seleccione una opción --', isactive: true });
		});
	}

}
