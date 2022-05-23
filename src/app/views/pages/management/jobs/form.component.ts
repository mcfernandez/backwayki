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

export class JobFormComponent implements OnInit, OnDestroy {
	
	loading$: Observable<boolean>;
	
	selectedTab = 0;

	id: string = "";
	name: string = "";
	description: string = "";

	entityname: string = "";

	_pathservice: string = "job";
	_entityname: string = "ocupación";
	_pathurl: string = "/management/jobs";

	_IsEdit: boolean = false;
	_IsCreate: boolean = false;

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

	getTitle() {
		if (this.entityname == "")
			return `Crear ${ this._entityname }`;
		else
			return `Editar ${ this._entityname }: ${ this.entityname }`;
	}

}
