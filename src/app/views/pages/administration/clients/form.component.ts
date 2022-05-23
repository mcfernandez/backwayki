// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-form',
	templateUrl: './form.component.html',
})

export class ClientFormComponent implements OnInit, OnDestroy {
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	urlPath: string = environment.urlFile;
	urlFile: string = "";

	model: any = {
		"id": null,
		"name": null,
		"firstname": null,
		"lastname": null,
		"email": null,
		"birthdate": null,
		"sexid": null,
		"documenttypeid": null,
		"documentnumber": null,
		"maritalstatusid": null,
		"jobid": null,
		"countryid": null,
		"mobilenumber": null,
		"foodpreferencesid": null,
		"foodobservation": null,
		"allergyobservation": null,
		"medicalrequirement": null,
		"travelpurposeid": null,
		"trekkingexperienceid": null,
		"description": null,
		"status": null,
		"createdon": null,
		"createdbyname": null,
		"modifiedon": null,
		"modifiedbyname": null,
		"urlFile": null
	};

	id: string = "";

	entityname: string = "";

	_pathservice: string = "client";
	_entityname: string = "cliente";
	_pathurl: string = "/administration/clients";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;
	_IsShow: boolean = false;

	listDocumentType: any[] = [];
	listSex: any[] = [];
	listMaritalStatus: any[] = [];
	listFoodPreferences: any[] = [];
	listTravelPurpose: any[] = [];
	listTrekkingExperience: any[] = [];
	listCountry: any[] = [];
	listJob: any[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private _commonService: CommonService) { 

	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			var isok = false;
			var paths = this.router.url.split("/");

			if (paths.length == 5 && paths[3] == "view") {
				this._IsShow = true;
				isok = this.setData(paths[4]);
			}
/*
			if (paths.length == 5 && paths[3] == "edit")
				isok = this.setData(paths[4]);

			if (paths.length == 4 && paths[3] == "create") {
				this.reset();

				isok = true;
			}
*/
			if (!(isok)) {
				Swal.fire({ icon: 'error', title: 'Error', text: `Información no válida del ${ this._entityname }` })

				this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
			}

			this.getOptionList();
		});
	}

	ngOnDestroy() {
		
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		this.urlFile = "";

		if (result == null)			
			return false;

		for (let field in result)
      		this.model[field] = result[field] == null ? '' : result[field];
		
		this.entityname = result.name;

		if (!((this.model.urlFile == "") || (this.model.urlFile == undefined) || (this.model.urlFile == null))) {
			this.urlFile = `${ this.urlPath }${ this.model.urlFile }`;
			console.log(this.urlFile);
		}

		return true;
	}
/*
	validate() {
		let value = false;

		if ((this.name == "") || (this.name == undefined) || (this.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
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

				data.name = this.name;
				data.description = this.description;

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
				data.name = this.name;
				data.description = this.description;

				this._commonService.Update(url, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Actualizado', text: `La ${ this._entityname } se actualizo con exito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}
		}
	}
*/
	getOptionList() {
		this._commonService.List(`optionlist/listbykey/DocumentType`).subscribe((result: any[]) => {
			this.listDocumentType = result;
			
			this.listDocumentType.unshift({ id: null, name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/Sex`).subscribe((result: any[]) => {
			this.listSex = result;
			
			this.listSex.unshift({ id: null, name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/MaritalStatus`).subscribe((result: any[]) => {
			this.listMaritalStatus = result;
			
			this.listMaritalStatus.unshift({ id: null, name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/FoodPreference`).subscribe((result: any[]) => {
			this.listFoodPreferences = result;
			
			this.listFoodPreferences.unshift({ id: null, name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/TravelPurpose`).subscribe((result: any[]) => {
			this.listTravelPurpose = result;
			
			this.listTravelPurpose.unshift({ id: null, name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/TrekkingExperience`).subscribe((result: any[]) => {
			this.listTrekkingExperience = result;
			
			this.listTrekkingExperience.unshift({ id: null, name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`country/list`).subscribe((result: any[]) => {
			this.listCountry = result;
			
			this.listCountry.unshift({ id: null, name: "-- seleccione una opción --", status: true });
		});

		this._commonService.List(`job/list`).subscribe((result: any[]) => {
			this.listJob = result;
			
			this.listJob.unshift({ id: null, name: "-- seleccione una opción --", status: true });
		});
	}

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Ver ${ this._entityname }: ${ this.entityname }`;
	}

	openFile() {
		window.open(this.urlFile, '_blank');
	}

}
