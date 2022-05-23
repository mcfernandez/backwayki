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

export class CategoryFormComponent implements OnInit, OnDestroy {
	@ViewChild('_itemname', { static: false }) _itemname: ElementRef;
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	id: string = "";
	typeid: string = "";
	code: string = "";
	name: string = "";
	description: string = "";

	entityname: string = "";

	listItem: any[] = [];
	item: any = { id: "", code: "", name: "", description: "", isEdit: false };

	listType: any[] = [];

	_pathservice: string = "equipmentcategory";
	_entityname: string = "Categoría del equipo";
	_pathurl: string = "/equipment/category";

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
		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 1, "equipo", "categoria");
		
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

			if (this._IsEdit) {
				this.getItemList(this.id);
			}
		});
	}

	ngOnDestroy() {
		
	}

	reset() {
		this.id = "";
		this.code = "";
		this.typeid = "";
		this.name = "";
		this.description = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)
			return false;
		
		this.id = id;
		this.typeid = result.typeid;
		this.code = result.code;
		this.name = result.name;
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

		if ((this.typeid == "") || (this.typeid == undefined) || (this.typeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO) es obligatorio" });
			
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

				data.code = this.code;
				data.name = this.name;
				data.typeid = this.typeid;
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

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Editar ${ this._entityname }: ${ this.entityname }`;
	}

	// Item
	setItemClear() {
		this.item.isEdit = false;
		this.item.id = "";
		this.item.code = "";
		this.item.name = "";
		this.item.description = "";
	}

	setItemEdit(id: string, code: string, name: string, description: string) {
		this.item.isEdit = true;
		this.item.id = id;
		this.item.code = code;
		this.item.name = name;
		this.item.description = description;
	}

	getItemList(id: string) {
		this._commonService.List(`${ this._pathservice }/subcategory/list/${ id }`).subscribe((result: any[]) => {
			this.listItem = result;
		});
	}

	setItemCreate() {
		if ((this.item.code == "") || (this.item.code == undefined) || (this.item.code == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CÓDIGO) es obligatorio" });
			
			return;
		}

		if ((this.item.name == "") || (this.item.name == undefined) || (this.item.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		var data = { code: this.item.code, name: this.item.name, parentid: this.id, description: this.item.description };

		this._commonService.Create(`${ this._pathservice }/subcategory/create`, data).subscribe((result: any) => {
			if (result) {						
				this.setItemClear();
				this.getItemList(this.id);

				setTimeout(() => { this._itemname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El item de la ${ this._entityname } se creo con éxito`, MessageType.Update);
			}
		});
	}

	setItemUpdate() {
		if ((this.item.name == "") || (this.item.name == undefined) || (this.item.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return;
		}

		var data = { id: this.item.id, name: this.item.name, description: this.item.description };

		this._commonService.Update(`${ this._pathservice }/subcategory/update`, data).subscribe((result: any) => {
			if (result) {						
				this.setItemClear();
				this.getItemList(this.id);

				setTimeout(() => { this._itemname.nativeElement.focus(); }, 500);

				this.layoutUtilsService.showActionNotification(`El item de la ${ this._entityname } se actualizo con éxito`, MessageType.Update);
			}
		});
	}

	setItemDelete(id: string, name: string) {
		let _entityname = 'El item de la categoría del equipo';
		const _title = '¿Está seguro de borrar?';
		const _warningMessage = `${ _entityname } ${ name }`;
		const _waitMessage = `${ _entityname } ${ name } se está eliminando...`;
		const _resultMessage = `${ _entityname } ${ name } ha sido eliminado`;
		const dialog = this.layoutUtilsService.deleteElement(_title, _warningMessage, _waitMessage);

		dialog.afterClosed().subscribe(result => {
			if (!(result))
				return;

			this._commonService.Delete(`${ this._pathservice }/subcategory/delete/${ id }`).subscribe((result: boolean) => {
				if (result) {
					this.getItemList(this.id);

					setTimeout(() => { this._itemname.nativeElement.focus(); }, 500);

					this.layoutUtilsService.showActionNotification(_resultMessage, MessageType.Update);
				}
			});
		});
	}

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/TipoEquipo`).subscribe((result: any[]) => {
			this.listType = result;
			
			this.listType.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});
	}

}
