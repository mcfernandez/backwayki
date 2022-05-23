import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';
import { CommonService } from 'src/app/services/common.service';

@Component({
	selector: 'kt-shopping-form',
	templateUrl: './form.component.html',
})

export class CorporateClientFormComponent implements OnInit {

	loading$: Observable<boolean>;

	selectedTab: number = 0;

	model: any = {
		id: "",
		ruc: "",
		name: "",
		address: "",
		email: "",
		phone: "",
		firstname: "",
		lastname: "",
		description: ""
	};

	@ViewChild('_contactname', { static: false }) _contactname: ElementRef;
	contact: any = {
		name: "",
		email: "",
		phone: "",
		description: "",
		list: []
	};

	_entityname: string = "cliente corporativo";
	_name: string = "";

	_path: string = "corporateclient";
	_pathurl: string = `/administration/${ this._path }`;

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;

	constructor(private router: Router, private activatedRoute: ActivatedRoute, private _commonService: CommonService,
		        private layoutUtilsService: LayoutUtilsService) {

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
				Swal.fire({ icon: 'error', title: 'Error', text: `Información no válida del ${ this._entityname }` })

				this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
			}
		});
	}

	reset() {
		this.model.id = "";
		this.model.ruc = "";
		this.model.name = "";
		this.model.address = "";
		this.model.phone = "";
		this.model.description = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._path }-${ id }`));

		if (result == null)
			return false;

		this.model.id = id;
		this.model.ruc = result.ruc;
		this.model.name = result.name;
		this.model.address = result.address;
		this.model.email = result.email;
		this.model.phone = result.phone;
		this.model.firstname = result.firstname;
		this.model.lastname = result.lastname;
		this.model.description = result.description;

		this._name = result.name;
		this._IsEdit = true;

		this.getContactList(this.model.id);

		return true;
	}

	getValue(data: string): string {
		if ((data == "") || (data == undefined) || (data == null))
			return "";
			
		return data.trim();
	}

	validate() {
		if (this.model.ruc == "") {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (RUC) es obligatorio" });
			
			return false;
		}

		if (this.model.name == "") {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (RAZÓN SOCIAL) es obligatorio" });
			
			return false;
		}

		if (this.model.address == "") {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (DIRECCIÓN) es obligatorio" });
			
			return false;
		}
		
		return true;
	}

	save() {
		this.model.ruc = this.getValue(this.model.ruc);
		this.model.name = this.getValue(this.model.name);
		this.model.address = this.getValue(this.model.address);
		this.model.email = this.getValue(this.model.email);
		this.model.phone = this.getValue(this.model.phone);
		this.model.firstname = this.getValue(this.model.firstname);
		this.model.lastname = this.getValue(this.model.lastname);
		this.model.description = this.getValue(this.model.description);

		if (this.validate()) {
			let data: any = {};

			if (this._IsCreate) {
				data.ruc = this.model.ruc;
				data.name = this.model.name;
				data.address = this.model.address;
				data.email = this.model.email;
				data.phone = this.model.phone;
				data.firstname = this.model.firstname;
				data.lastname = this.model.lastname;
				data.description = this.model.description;

				this._commonService.Create(`${ this._path }/create`, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Creado', text: `La ${ this._entityname } se creo con éxito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}

			if (this._IsEdit) {
				data.id = this.model.id;
				data.ruc = this.model.ruc;
				data.name = this.model.name;
				data.address = this.model.address;
				data.phone = this.model.phone;
				data.description = this.model.description;

				this._commonService.Update(`${ this._path }/update`, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Actualizado', text: `La ${ this._entityname } se actualizo con exito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}
		}
	}

	getTitle() {
		if (this._IsCreate)
			return `Crear ${ this._entityname }`;
		
		return `Editar ${ this._entityname }: ${ this._name }`;
	}

	// Contact
	setContactClear() {
		this.contact.name = "";
		this.contact.email = "";
		this.contact.phone = "";
		this.contact.description = "";
	}

	getContactList(id: string) {
		this._commonService.List(`${ this._path }/${ id }/contact/list`).subscribe((result: any[]) => {
			this.contact.list = result;

			setTimeout(() => { this._contactname.nativeElement.focus(); }, 500);
		});
	}

	setContactCreate() {
		this.contact.name = this.getValue(this.contact.name);
		this.contact.email = this.getValue(this.contact.email);
		this.contact.phone = this.getValue(this.contact.phone);
		this.contact.description = this.getValue(this.contact.description);

		if (this.contact.name == "") {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}
		
		if ((this.contact.email == "") || (this.contact.email == undefined) || (this.contact.email == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CORREO ELECTRONICO) es obligatorio" });
			
			return;
		}
		
		if ((this.contact.phone == "") || (this.contact.phone == undefined) || (this.contact.phone == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TELEFONO MÓVIL) es obligatorio" });
			
			return;
		}

		var data = { corporateclientid: this.model.id, name: this.contact.name, email: this.contact.email, mobilephone: this.contact.phone, description: this.contact.description };

		this._commonService.Create(`${ this._path }/contact/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setContactClear();
				this.getContactList(this.model.id);

				this.layoutUtilsService.showActionNotification(`El contacto del ${ this._entityname } se creo con éxito`, MessageType.Update);

				setTimeout(() => { this._contactname.nativeElement.focus(); }, 500);
			}
		});
	}

}
