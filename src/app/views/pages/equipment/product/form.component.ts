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

export class ProductFormComponent implements OnInit, OnDestroy {
	@ViewChild('_itemname', { static: false }) _itemname: ElementRef;
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	id: string = "";
	code: string = "";
	name: string = "";
	acquisitiondate: Date = null;
    categoryid: string = "";
	subcategoryid: string = "";
	brandid: string = "";
    model: string = "";
    material: string = "";
    color: string = "";
    serie: string = "";
    capacidad: string = "";
    fccid: string = "";
    conditionid: string = "";
    maintenance: boolean = false;
	description: string = "";

	entityname: string = "";

	listCondition: any = [];
	listBrand: any = [];
	listType: any = [];
	listCategory: any = [];
	listSubCategory: any = [];

	_pathservice: string = "product";
	_entityname: string = "Producto";
	_pathurl: string = "/equipment/product";

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

		this.acquisitiondate = result.acquisitiondate;
		this.categoryid = result.categoryid;
		
		this.brandid = result.brandid;
		this.model = result.model;
		this.material = result.material;
		this.color = result.color;
		this.serie = result.serie;
		this.capacidad = result.capacidad;
		this.fccid = result.fccid;
		this.conditionid = result.conditionid;
		this.maintenance = result.maintenance;
		
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

		if ((this.acquisitiondate == undefined) || (this.acquisitiondate == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (FECHA DE ADQUISICION) es obligatorio" });
			
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

		if ((this.brandid == "") || (this.brandid == undefined) || (this.brandid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MARCA) es obligatorio" });
			
			return value;
		}

		if ((this.model == "") || (this.model == undefined) || (this.model == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MODELO) es obligatorio" });
			
			return value;
		}

		if ((this.material == "") || (this.material == undefined) || (this.material == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (MATERIAL) es obligatorio" });
			
			return value;
		}

		if ((this.color == "") || (this.color == undefined) || (this.color == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (COLOR) es obligatorio" });
			
			return value;
		}

		if ((this.serie == "") || (this.serie == undefined) || (this.serie == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (SERIE) es obligatorio" });
			
			return value;
		}
		
		if ((this.capacidad == "") || (this.capacidad == undefined) || (this.capacidad == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (CAPACIDAD) es obligatorio" });
			
			return value;
		}
		
		if ((this.fccid == "") || (this.fccid == undefined) || (this.fccid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (FCCID) es obligatorio" });
			
			return value;
		}
		
		if ((this.conditionid == "") || (this.conditionid == undefined) || (this.conditionid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "El campo (ESTADO DE LA CONDICION) es obligatorio" });
			
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
				data.acquisitiondate = this.acquisitiondate;
				data.categoryid = this.subcategoryid;
				data.brandid = this.brandid;
				data.model = this.model;
				data.material = this.material;
				data.color = this.color;
				data.serie = this.serie;
				data.capacidad = this.capacidad;
				data.fccid = this.fccid;
				data.conditionid = this.conditionid;
				data.maintenance = false;
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
				data.acquisitiondate = this.acquisitiondate;
				data.brandid = this.brandid;
				data.model = this.model;
				data.material = this.material;
				data.color = this.color;
				data.serie = this.serie;
				data.capacidad = this.capacidad;
				data.fccid = this.fccid;
				data.conditionid = this.conditionid;
				data.maintenance = false;
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
		this._commonService.List(`optionlist/listbykey/EstadoEquipo`).subscribe((result: any[]) => {
			this.listCondition = result;
			
			this.listCondition.unshift({ id: "", name: "-- seleccione una opción --", isactive: true });
		});

		this._commonService.List(`brand/list`).subscribe((result: any[]) => {
			this.listBrand = result;
			
			this.listBrand.unshift({ id: "", name: "-- seleccione una opción --", status: true });
		});

		this._commonService.List(`optionlist/listbykey/TipoEquipo`).subscribe((result: any[]) => {
			this.listType = result;
						
			this._commonService.List(`equipmentcategory/list`).subscribe((result: any[]) => {
				var tool = this.listType.filter(m => m.code == "Equipo");
	
				this.listCategory = result.filter(m => m.typeid == tool[0].id);

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
