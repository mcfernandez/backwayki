// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs';

import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-resourcesallocation-form',
	templateUrl: './form.component.html',
})

export class ResourceAllocationFormComponent implements OnInit, OnDestroy {

	loading$: Observable<boolean>;

	selectedTab = 0;

	id: string = "";
	typeserviceid: string = "";
	serviceorder: string = "";
	passenger: number = null;
	departuredate: Date = null;
    returndate: Date = null;
  	group: number = null;
	description: string = "";

	almacen: string = "";
	guias: string = "";
	cocineros: string = "";
	porters: string = "";
	alimentacion: string = "";
	transporte: string = "";

	entityname: string = "";

	_pathservice: string = "resourceallocation";
	_entityname: string = "asignación de recursos";
	_pathurl: string = "/operation/resourcesallocation";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;

	listTypeService: any = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _commonService: CommonService) { 

	}

	ngOnInit() {
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
				Swal.fire({ icon: 'error', title: 'Error', text: `Información no válida de la ${ this._entityname }` })

				this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
			}

			this.getOptionList();
		});
	}

	ngOnDestroy() {
		
	}

	reset() {
		this.id = "";
	  	this.typeserviceid = "";
	  	this.serviceorder = "";
	  	this.passenger = null;
	  	this.departuredate = null;
	  	this.returndate = null;
	  	this.group = null;
	  	this.description = "";

	  	this.almacen = "";
	  	this.guias = "";
	  	this.cocineros = "";
	  	this.porters = "";
	  	this.alimentacion = "";
	  	this.transporte = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)
			return false;
		
		this.id = id;
		this.typeserviceid = result.typeserviceid;
	  	this.serviceorder = result.serviceorder;
	  	this.passenger = result.passenger;
	  	this.departuredate = result.departuredate;
	  	this.returndate = result.returndate;
	  	this.group = result.groups;
		this.description = result.description;

		if (this.description == null || this.description == "") {
			this.almacen = "";
			this.guias = "";
			this.cocineros = "";
			this.porters = "";
			this.alimentacion = "";
			this.transporte = "";
		}
		else {
			var obj = JSON.parse(this.description);

			this.almacen = obj.almacen;
			this.guias = obj.guias;
			this.cocineros = obj.cocineros;
			this.porters = obj.porters;
			this.alimentacion = obj.alimentacion;
			this.transporte = obj.transporte;
		}

		this.entityname = result.name;

		this._IsEdit = true;

		return true;
	}

	validate() {
		let value = false;

		if ((this.typeserviceid == "") || (this.typeserviceid == undefined) || (this.typeserviceid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO DE SERVICIO) es obligatorio" });
			
			return value;
		}

		if ((this.serviceorder == "") || (this.serviceorder == undefined) || (this.serviceorder == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (ORDEN DE SERVICIO) es obligatorio" });
			
			return value;
		}

		if ((this.passenger == undefined) || (this.passenger == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CANTIDAD DE PASAJEROS) es obligatorio" });
			
			return value;
		}

		if ((this.group == undefined) || (this.group == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NÚMERO DE GRUPOS) es obligatorio" });
			
			return value;
		}

		if ((this.departuredate == undefined) || (this.departuredate == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (FECHA DE SALIDA) es obligatorio" });
			
			return value;
		}

		if ((this.returndate == undefined) || (this.returndate == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (FECHA DE RETORNO) es obligatorio" });
			
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

				data.typeserviceid = this.typeserviceid;
				data.serviceorder = this.serviceorder;
				data.passenger = this.passenger;
				data.departuredate = this.departuredate;
				data.returndate = this.returndate;
				data.group = this.group;
				
				var operation = {
					almacen: this.almacen,
					guias: this.guias,
					cocineros: this.cocineros,
					porters: this.porters,
					alimentacion: this.alimentacion,
					transporte: this.transporte,
				};

				data.description = JSON.stringify(operation);

				this._commonService.Create(url, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Creado', text: `La ${ this._entityname } se creo con éxito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}

			if (this.id != "") {
				url = `${ this._pathservice }/update`;

				data.id = this.id;
				data.passenger = this.passenger;
				data.departuredate = this.departuredate;
				data.returndate = this.returndate;
				data.group = this.group;
				
				var operation = {
					almacen: this.almacen,
					guias: this.guias,
					cocineros: this.cocineros,
					porters: this.porters,
					alimentacion: this.alimentacion,
					transporte: this.transporte,
				};

				data.description = JSON.stringify(operation);

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

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/CategoriaPrecio`).subscribe((result: any[]) => {
			this.listTypeService = result;
			
			this.listTypeService.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});
	}

}
