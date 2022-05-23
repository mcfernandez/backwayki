// Angular
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// RxJS
import { Observable } from 'rxjs';

import { LayoutUtilsService, MessageType, QueryParamsModel } from 'src/app/core/_base/crud';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

import { Authorization } from 'src/app/app.utility';

@Component({
	selector: 'kt-form',
	templateUrl: './form.component.html',
})

export class AdditionalServiceFormComponent implements OnInit, OnDestroy {
	@ViewChild('_detailname', { static: false }) _detailname: ElementRef;

	loading$: Observable<boolean>;
	
	selectedTab = 0;

	TYPE_Detail = "cd690c10-c83b-406b-af71-7d29670845e6";
	TYPE_Special = "f9b86788-e9ee-4074-a843-910fe7547ae4";

	ShowPrice = true;
	ShowDetail = false;

	id: string = "";
	name: string = "";
	typeid: string = "";
	price: number = 0;
	description: string = "";

	entityname: string = "";

	_pathservice: string = "additionalservice";
	_entityname: string = "servicio adicional";
	_pathurl: string = "/management/additionalservices";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;
	_IsRead: boolean = false;

	listType: any[] = [];

	listDetail: any[] = [];
	detail: any = { id: "", name: "", price: 0, description: "", isEdit: false };

	permission: any[] = [];

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private _commonService: CommonService, private layoutUtilsService: LayoutUtilsService) { 

	}

	ngOnInit() {
		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 1, "gestion", "servicioadicional");
		
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

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/TypeAdditionalService`).subscribe((result: any[]) => {
			this.listType = result;
			
			this.listType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});
	}

	reset() {
		this.id = "";
		this.name = "";
		this.typeid = "";
		this.price = 0;
		this.description = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)			
			return false;
		
		this.id = result.id;
		this.name = result.name;
		this.typeid = result.typeid;
		this.price = result.price;
		this.description = result.description;
		
		this.entityname = result.name;

		this.OnChangeType({ value: this.typeid });

		if (this.TYPE_Detail == this.typeid) {
			this.getDetailList(this.id);
		}

		this._IsEdit = true;

		return true;
	}

	validate() {
		let value = false;

		if ((this.name == "") || (this.name == undefined) || (this.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return value;
		}

		if ((this.typeid == "") || (this.typeid == undefined) || (this.typeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO) es obligatorio" });
			
			return value;
		}

		if ((this.price < 0) || (this.price == undefined) || (this.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio y debe ser mayor a 0 (cero)" });
			
			return value;
		}

		if (this.TYPE_Detail == this.typeid) {
			if (this.listDetail.length == 0) {
				Swal.fire({ icon: 'warning', title: 'Obligatorio', text: "Debe ingresar el detalle del servicio adicional" });
			
				return value;
			}
		}
		
		return true;
	}

	save() {
		if (this.validate()) {
			let data: any = {};
			let url: string = "";

			if (this.id == "") {
				data = { name: this.name, typeid: this.typeid, price: this.price, description: this.description, detail: [] };

				if (this.TYPE_Detail == this.typeid) {
					for (let i = 0; i < this.listDetail.length; i++)
						data.detail.push({ name: this.listDetail[i].name, price: this.listDetail[i].price, description: this.listDetail[i].description });
				}

				this._commonService.Create(`${ this._pathservice }/create`, data).subscribe((result: any) => {
					if (result) {						
						Swal.fire({ icon: 'success', title: 'Creado', text: `La ${ this._entityname } se creo con éxito` })

						this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
					}
				});
			}

			if (this.id != "") {
				data = { id: this.id, name: this.name, price: this.price, description: this.description };

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

	// Service included
	setDetailClear() {
		this.detail.isEdit = false;
		this.detail.id = "";
		this.detail.name = "";
		this.detail.price = 0;
		this.detail.description = "";
	}

	setDetailEdit(id: string, name: string, price: number, description: string) {
		this.detail.isEdit = true;
		this.detail.id = id;
		this.detail.name = name;
		this.detail.price = price;
		this.detail.description = description;
	}

	getDetailList(id: string) {
		this._commonService.List(`${ this._pathservice }/${ id }/list`).subscribe((result: any[]) => {
			this.listDetail = result;
		});
	}

	setDetailCreate() {
		if ((this.detail.name == "") || (this.detail.name == undefined) || (this.detail.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		if ((this.detail.price < 0) || (this.detail.price == undefined) || (this.detail.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio y debe ser mayor a 0 (cero)" });
			
			return;
		}

		if (this._IsEdit) {
			var data = { parentid: this.id, name: this.detail.name, price: this.detail.price, description: this.detail.description };
	
			this._commonService.Create(`${ this._pathservice }/detail/create`, data).subscribe((result: any) => {
				if (result) {						
					this.setDetailClear();
					this.getDetailList(this.id);
	
					setTimeout(() => { this._detailname.nativeElement.focus(); }, 500);
	
					this.layoutUtilsService.showActionNotification(`El detalle del ${ this._entityname } se creo con éxito`, MessageType.Update);
				}
			});
		}
		else {
			this.listDetail.push({ id: this.GenerateUUID(), name: this.detail.name, price: Number.parseFloat(this.detail.price), description: this.detail.description });
			
			this.setDetailClear();

			setTimeout(() => { this._detailname.nativeElement.focus(); }, 500);
			
			this.layoutUtilsService.showActionNotification(`El detalle del servicio adicional se agrego con éxito`, MessageType.Update);
		}
	}

	setDetailUpdate() {
		if ((this.detail.name == "") || (this.detail.name == undefined) || (this.detail.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		if ((this.detail.price < 0) || (this.detail.price == undefined) || (this.detail.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio y debe ser mayor a 0 (cero)" });
			
			return;
		}

		if (this._IsEdit) {
			var data = { id: this.detail.id, name: this.detail.name, price: this.detail.price, description: this.detail.description };

			this._commonService.Update(`${ this._pathservice }/update`, data).subscribe((result: any) => {
				if (result) {						
					this.setDetailClear();
					this.getDetailList(this.id);
	
					setTimeout(() => { this._detailname.nativeElement.focus(); }, 500);
	
					this.layoutUtilsService.showActionNotification(`El detalle del ${ this._entityname } se actualizo con éxito`, MessageType.Update);
				}
			});
		}
		else {
			var filter = this.listDetail.filter(m => m.id != this.detail.id);
			this.listDetail = filter;

			this.listDetail.push({ id: this.detail.id, name: this.detail.name, price: Number.parseFloat(this.detail.price), description: this.detail.description });
			
			this.setDetailClear();

			setTimeout(() => { this._detailname.nativeElement.focus(); }, 500);
			
			this.layoutUtilsService.showActionNotification(`El detalle del servicio adicional se actualizo con éxito`, MessageType.Update);
		}
	}

	setDetailDelete(id: string, name: string) {
		let _entityname = 'El detalle del servicio adicional';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			if (this._IsEdit) {
				this._commonService.Delete(`${ this._pathservice }/${ id }/delete`).subscribe((result: boolean) => {
					if (result) {
						this.getDetailList(this.id);
	
						setTimeout(() => { this._detailname.nativeElement.focus(); }, 500);
	
						this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
					}
				});
			}
			else {
				var filter = this.listDetail.filter(m => m.id !== id);
				this.listDetail = filter;

				setTimeout(() => { this._detailname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
			}
		});
	}

	OnChangeType(event: any): void {
		this.ShowPrice = true;
		this.ShowDetail = false;

		if (event.value == this.TYPE_Detail || event.value == this.TYPE_Special) {
			this.price = 0;
			this.ShowPrice = false;

			if (event.value == this.TYPE_Detail) {
				this.ShowDetail = true;
				this.listDetail = [];
			}
		}
	}

	GenerateUUID(): string { // Public Domain/MIT
		var d = new Date().getTime();//Timestamp
		var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16;//random number between 0 and 16
			if(d > 0){//Use timestamp until depleted
				r = (d + r)%16 | 0;
				d = Math.floor(d/16);
			} else {//Use microseconds since page-load if supported
				r = (d2 + r)%16 | 0;
				d2 = Math.floor(d2/16);
			}
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

}
