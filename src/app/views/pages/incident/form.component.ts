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

export class IncidentFormComponent implements OnInit, OnDestroy {
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	id: string = "";
	name: string = "";
	typename: string = "";
	statusname: string = "";
	clientname: string = "";
	bookingname: string = "";
	advisername: string = "";
	description: string = "";
	response: string = "";
	observation: string = "";

	entityname: string = "";

	_pathservice: string = "incident";
	_entityname: string = "incidente";
	_pathurl: string = "/incidents";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;

	listType: any[] = [];

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private _commonService: CommonService) { 

	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			var isok = false;
			var paths = this.router.url.split("/");			

			if (paths.length == 4 && paths[2] == "edit")
				isok = this.setData(paths[3]);
/*
			if (paths.length == 4 && paths[3] == "create") {
				this.reset();

				isok = true;
			}
*/
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
		this.typename = "";
		this.statusname = "";
		this.description = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)			
			return false;
		
		this.id = result.id;
		this.name = result.name;
		this.typename = result.typename;
		this.statusname = result.statusname;
		this.clientname = result.clientname;
		this.bookingname = result.bookingname;
		this.advisername = result.advisername;
		this.description = result.description;
		this.response = result.response;
		this.observation = result.observation;
		
		this.entityname = result.name;

		this._IsEdit = (this.statusname != "Closed");

		return true;
	}

	validate(isclose: boolean) {
		let value = false;

		if ((this.observation == "") || (this.observation == undefined) || (this.observation == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (OBSERVACIÓN) es obligatorio" });
			
			return value;
		}

		if (isclose) {
			if ((this.response == "") || (this.response == undefined) || (this.response == null)) {
				Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (RESPUESTA) es obligatorio" });
				
				return value;
			}
		}
		
		return true;
	}

	save(isclose: boolean) {
		debugger
		if (this.validate(isclose)) {
			let data: any = {};
			let url: string = "";
/*
			if (this.id == "") {
				data = { name: this.name, typeid: this.typeid, price: this.price, description: this.description };

				this._commonService.Create(`${ this._pathservice }/create`, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Creado', text: `La ${ this._entityname } se creo con éxito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}
*/
			if (this.id != "") {
				data = { id: this.id, response: this.response, observation: this.observation, close: isclose };

				this._commonService.Update(`${ this._pathservice }/update`, data).subscribe((result: any) => {
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

}
