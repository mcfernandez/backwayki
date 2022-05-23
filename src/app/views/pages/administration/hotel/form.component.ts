// Angular
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/services/common.service';

import { Authorization } from 'src/app/app.utility';

@Component({
	selector: 'kt-form',
	templateUrl: './form.component.html',
})

export class HotelFormComponent implements OnInit, OnDestroy {
	@ViewChild('_itemname', { static: false }) _itemname: ElementRef;
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	id: string = "";
	name: string = "";
	code: string = "";
	ruc: string = "";
	categoryid: string = "";
	city: string = "";
	address: string = "";
	phone: string = "";
	grupallimit: number = 0;
	accountbank: string = "";
	email: string = "";
	url: string = "";
	facebook: string = "";
	twitter: string = "";
	description: string = "";

	entityname: string = "";

	listItem: any[] = [];
	item: any = { id: "", code: "", name: "", description: "", isEdit: false };

	listCategory: any[] = [];

	_pathservice: string = "hotel";
	_entityname: string = "Hotel";
	_pathurl: string = "/administration/hotel";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;
	_IsRead: boolean = false;

	permission: any[] = [];

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private _commonService: CommonService) { 

	}

	ngOnInit() {
		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 1, "administracion", "hotel");
		
		this.activatedRoute.params.subscribe(params => {
			var isok = false;
			var paths = this.router.url.split("/");			

			if (paths.length == 5 && paths[3] == "edit") {
				let read = Authorization.Action(1, this.permission);
				let update = Authorization.Action(2, this.permission);

				if (!(update))
					this._IsRead = read;
					
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

			this.getOptionList();
		});
	}

	ngOnDestroy() {
		
	}

	reset() {
		this.id = "";
		this.name = "";
		this.code = "";
		this.ruc = "";
		this.categoryid = "";
		this.city = "";
		this.address = "";
		this.phone = "";
		this.grupallimit = 0;
		this.accountbank = "";
		this.email = "";
		this.url = "";
		this.facebook = "";
		this.twitter = "";
		this.description = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)
			return false;
		
		this.id = id;
		this.name = result.name;
		this.code = result.code;
		this.ruc = result.ruc;
		this.categoryid = result.categoryid;
		this.name = result.name;
		this.city = result.city;
		this.address = result.address;
		this.phone = result.phone;
		this.grupallimit = result.grupallimit;
		this.accountbank = result.accountbank;
		this.email = result.email;
		this.url = result.url;
		this.facebook = result.facebook;
		this.twitter = result.twitter;
		this.description = result.description;
		
		this.entityname = result.name;

		this._IsEdit = true;

		return true;
	}

	validate() {
		let value = false;

		if ((this.code == "") || (this.code == undefined) || (this.code == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CÓDIGO) es obligatorio" });
			
			return value;
		}

		if ((this.ruc == "") || (this.ruc == undefined) || (this.ruc == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (RUC) es obligatorio" });
			
			return value;
		}

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

				data.code = this.code;
				data.ruc = this.ruc;
				data.categoryid = this.categoryid;
				data.city = this.city;
				data.address = this.address;
				data.phone = this.phone;
				data.grupallimit = this.grupallimit;
				data.accountbank = this.accountbank;
				data.email = this.email;
				data.url = this.url;
				data.facebook = this.facebook;
				data.twitter = this.twitter;

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

				data.ruc = this.ruc;
				data.categoryid = this.categoryid;
				data.city = this.city;
				data.address = this.address;
				data.phone = this.phone;
				data.grupallimit = this.grupallimit;
				data.accountbank = this.accountbank;
				data.email = this.email;
				data.url = this.url;
				data.facebook = this.facebook;
				data.twitter = this.twitter;

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

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Editar ${ this._entityname }: ${ this.entityname }`;
	}

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/CategoriaHotel`).subscribe((result: any[]) => {
			this.listCategory = result;
			
			this.listCategory.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});
	}

}
