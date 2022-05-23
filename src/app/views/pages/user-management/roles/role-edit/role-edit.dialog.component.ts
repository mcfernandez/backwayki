// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// RxJS
import { Observable, of, Subscription } from 'rxjs';
// Lodash
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { each, find, some } from 'lodash';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// Services and Models
import {
	Role,
	Permission,
	selectRoleById,
	RoleUpdated,
	selectAllPermissions,
	selectLastCreatedRoleId,
	RoleOnServerCreated
} from '../../../../../core/auth';
import { delay } from 'rxjs/operators';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-role-edit-dialog',
	templateUrl: './role-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.Default,
})
export class RoleEditDialogComponent implements OnInit, OnDestroy {
	// Public properties
	role: Role;
	role$: Observable<Role>;
	hasFormErrors = false;
	viewLoading = false;
	loadingAfterSubmit = false;
	allPermissions$: Observable<Permission[]>;
	rolePermissions: Permission[] = [];
	// Private properties
	module: any;
	module_list: any;
	estados = [
		{ value: '', viewValue: 'Seleccion' },
		{ value: '1', viewValue: 'Activo' },
		{ value: '2', viewValue: 'Desactivo' }
	];
	name: any;
	descripcion: any;
	estado: any;
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param data: any
	 * @param store: Store<AppState>
	 */
	constructor(private _security: SecurityService,
		public matDialogRef: MatDialogRef<RoleEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private layoutUtilsService: LayoutUtilsService) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.getModules();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {

	}





	getModules() {
		let url: string = `module`;
		this._security.getList(url).subscribe((value: any) => {
			this.module_list = value;
		});
	}

	/**
	 * Save data
	 */
	validar() {
		let valor = true;
		if ((this.name == "") || (this.name == undefined) || (this.name == null)) {
			Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (NOMBRE) es obligatorio"
			})
			valor = false;
			return valor;
		}
		if ((this.descripcion == "") || (this.descripcion == undefined) || (this.descripcion == null)) {
			Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (DESCRIPCION) es obligatorio"
			})
			valor = false;
			return valor;
		}
	}
	guardar() {
		if(this.validar()){
			let data = {
				"name": this.name,
				"description": this.descripcion,
				"status": this.estado == 1 ? true : false
			}
			this._security.postRol(data).subscribe((res: any) => {
				for (let i = 0; i < this.module_list.length; i++) {
					let x = 0;
					if (this.module_list[i].subitems != null) {
						for (const item of this.module_list[i].subitems) {
							if (item.status == true) {
								x = 1;
								break;
							}
						}
					} else {
						if (this.module_list[i].status == true) {
							x = 1;
						}
					}
					if (x == 0) {
						this.module_list[i].status = false;
					} else {
						this.module_list[i].status = true;
					}
				}
				let data_module ={
					"jsonMenu": JSON.stringify(this.module_list)
				  } 
				console.log(data_module);
				this._security.posModule(res, data_module).subscribe((res2: any) => {
					if (res2 == true) {
						this.layoutUtilsService.showActionNotification('Se Guardo con exito el Rol', MessageType.Update);
						this.matDialogRef.close();
					}
				});
			});
		}
	
	}
	cancelar(){
		this.matDialogRef.close();
	}



}
