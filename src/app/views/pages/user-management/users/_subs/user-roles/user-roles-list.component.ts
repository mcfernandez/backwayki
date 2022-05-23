// Angular
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-user-roles-list',
	templateUrl: './user-roles-list.component.html'
})
export class UserRolesListComponent implements OnInit {
	usuario:  any[]=[];
	admin: boolean = false;
	tecnico: boolean = false;
	id: string;
	color: string = 'primary';
	name: string;
	lastname: string;
	roles: any[]=[];
	roles2:  any[]=[];
	estados = [
		{ value: '', viewValue: 'Seleccion' },
		{ value: 'true', viewValue: 'Activo' },
		{ value: 'false', viewValue: 'Desactivo' }
	];

	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		public matDialogRef: MatDialogRef<UserRolesListComponent>,
		private layoutUtilsService: LayoutUtilsService,
		private _security: SecurityService,) { }

	ngOnInit() {
		this.getListRol();
		this.id = this.data.id;
		this.name = this.data.name;
		this.lastname = this.data.lastname;

	}

	cambio_rol(id, value) {
		for (const rol of this.roles) {
			if (value == true) {
				if (rol.id != id) {
					rol.status = false;
				}
			} else {
				rol.status = false;
			}
		}
	}
	getRolUser() {
		///api/role/user/{userId}/list
		let url: string = `role/user/${this.id}/list`;
		this._security.getList(url).subscribe((value: any) => {
			this.usuario = value;
			if(this.usuario.length>0){
				for (const rol of this.roles2) {
					if (this.usuario[0].id == rol.id) {
						rol.status = true;
					} else {
						rol.status = false;
					}
				}
			}else{
				for (const rol of this.roles2) {
						rol.status = false;
				}

			}
			this.roles=this.roles2;
			
		});

	}

	guardar() {
		let validar=this.roles.find(x=>x.status===true)
		if(validar==undefined){
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: "Por los menos seleccionar un rol al usuario"
			})
		}else{
				let ruta=`role/${validar.id}/update/${this.id}`;
				let data = {}
				this._security.updateUser(data, ruta).subscribe((res: any) => {
				  if (res == true) {
					console.log(res);
					this.layoutUtilsService.showActionNotification('Rol Insertado', MessageType.Update);
					this.matDialogRef.close();
				  }
				});
			  
		}
	}
	getListRol() {
		let url: string = `role/list`;
		this._security.getList(url).subscribe((value: any) => {
			this.roles2 = value;
			this.getRolUser();
		});
	}
	cancelar(){
		this.matDialogRef.close();
	}

}
