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

export class FoodFormComponent implements OnInit, OnDestroy {
	@ViewChild('_itemname', { static: false }) _itemname: ElementRef;
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	id: string = "";
	code: string = "";
	name: string = "";
    categoryid: string = "";
	subcategoryid: string = "";
	typeid: string = "";
    quantitymeasure: number = 0;
    unitmeasureid: string = "";
    price: number = 0;
    typecontainerid: string = "";
    containeruseid: string = "";
	description: string = "";

	entityname: string = "";

	listType: any = [];
	listTypeFood: any = [];
	listUnitMeasure: any = [];
	listTypeContainer: any = [];
	listContainerUse: any = [];
	listCategory: any = [];
	listSubCategory: any = [];

	_pathservice: string = "food";
	_entityname: string = "Alimento";
	_pathurl: string = "/equipment/food";

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
		this.permission = Authorization.Permission(localStorage.getItem('infoauth'), 1, "equipo", "producto");
		
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
		this.code = "";
		this.name = "";
		this.description = "";

		this._IsCreate = true;
	}

	setData(id: string) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));
		
		if (result == null)
			return false;
		
		this.id = id;
		this.code = result.code;
		this.name = result.name;
		this.description = result.description;
		
		this.categoryid = result.categoryid;
        this.typeid = result.typeid;
        this.quantitymeasure = result.quantitymeasure;
        this.unitmeasureid = result.unitmeasureid;
        this.price = result.price;
        this.typecontainerid = result.typecontainerid;
        this.containeruseid = result.containeruseid;

		this.SetCategory(result.categoryid, result.subcategoryid);

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

		if ((this.name == "") || (this.name == undefined) || (this.name == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (NOMBRE) es obligatorio" });
			
			return value;
		}

		if ((this.categoryid == "") || (this.categoryid == undefined) || (this.categoryid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CATEGORIA) es obligatorio" });
			
			return value;
		}

		if ((this.subcategoryid == "") || (this.subcategoryid == undefined) || (this.subcategoryid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SUB CATEGORIA) es obligatorio" });
			
			return value;
		}

		if ((this.typeid == "") || (this.typeid == undefined) || (this.typeid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TIPO) es obligatorio" });
			
			return value;
		}

		if ((this.quantitymeasure <= 0) || (this.quantitymeasure == undefined) || (this.quantitymeasure == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CANTIDAD DE MEDIDA) es obligatorio" });
			
			return value;
		}

		if ((this.unitmeasureid == "") || (this.unitmeasureid == undefined) || (this.unitmeasureid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (UNIDAD DE MEDIDA) es obligatorio" });
			
			return value;
		}

		if ((this.price <= 0) || (this.price == undefined) || (this.price == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (PRECIO) es obligatorio" });
			
			return value;
		}

		if ((this.typecontainerid == "") || (this.typecontainerid == undefined) || (this.typecontainerid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (TRANSPORTE DE ENVASE) es obligatorio" });
			
			return value;
		}
		
		if ((this.containeruseid == "") || (this.containeruseid == undefined) || (this.containeruseid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (ENVASE REUTILIZABLE) es obligatorio" });
			
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
				data.categoryid = this.subcategoryid;
				data.typeid = this.typeid;
				data.quantitymeasure = this.quantitymeasure;
				data.unitmeasureid = this.unitmeasureid;
				data.price = this.price;
				data.typecontainerid = this.typecontainerid;
				data.containeruseid = this.containeruseid;
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
				data.name = this.name;
				data.typeid = this.typeid;
				data.quantitymeasure = this.quantitymeasure;
				data.unitmeasureid = this.unitmeasureid;
				data.price = this.price;
				data.typecontainerid = this.typecontainerid;
				data.containeruseid = this.containeruseid;
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

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Editar ${ this._entityname }: ${ this.entityname }`;
	}

	getOptionList() {
		this._commonService.List(`optionlist/listbykey/EnvaseR`).subscribe((result: any[]) => {
			this.listContainerUse = result;
			
			this.listContainerUse.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/TEnvase`).subscribe((result: any[]) => {
			this.listTypeContainer = result;
			
			this.listTypeContainer.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/UnidadMedida`).subscribe((result: any[]) => {
			this.listUnitMeasure = result;
			
			this.listUnitMeasure.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/TipoAlimento`).subscribe((result: any[]) => {
			this.listTypeFood = result;
			
			this.listTypeFood.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`optionlist/listbykey/TipoEquipo`).subscribe((result: any[]) => {
			this.listType = result;
						
			this._commonService.List(`equipmentcategory/list`).subscribe((result: any[]) => {
				var food = this.listType.filter(m => m.code == "Alimento");
	
				this.listCategory = result.filter(m => m.typeid == food[0].id);

				this.listCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });

				this.listSubCategory = [];
				this.listSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
			});
		});
	}

	onChangeCategory(event: any) {		
		this.listSubCategory = [];
		this.listSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
		this.subcategoryid = "";

		if (event != null) {
			if (!((event.value == "") || (event.value == undefined) || (event.value == null))) {
				this._commonService.List(`equipmentcategory/subcategory/list/${ event.value }`).subscribe((result: any[]) => {
					this.listSubCategory = result;

					this.listSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
				});
			}
		}
	}

	SetCategory(categoryid: string, subcategoryid: string) {		
		this.listSubCategory = [];
		this.listSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });
		this.subcategoryid = "";

		this._commonService.List(`equipmentcategory/subcategory/list/${ categoryid }`).subscribe((result: any[]) => {
			this.listSubCategory = result;

			this.listSubCategory.unshift({ id: "", name: "-- seleccione una opción --", status: true });

			this.subcategoryid = subcategoryid;
		});
	}

}
