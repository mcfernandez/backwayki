import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SecurityService } from 'src/app/services/security.service';
import { UtilitiesService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-change-my-password',
	templateUrl: './change-my-password.component.html',
	styleUrls: ['./change-my-password.component.scss']
})
export class ChangeMyPasswordComponent implements OnInit {

	id: any;
	name: string;
	lastname: string;
	password: string;
	password2: string;

	/**
	 * Component constructor
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(private _security: SecurityService,
		public matDialogRef: MatDialogRef<ChangeMyPasswordComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _utilities: UtilitiesService,
		private layoutUtilsService: LayoutUtilsService) {
	}


	ngOnInit() {
		this.id = this._utilities.getSession('id');
		this.name = this._utilities.getSession('Name');
		this.lastname = this._utilities.getSession('lastName');
		// this.layoutUtilsService.showActionNotification('hola', MessageType.Update, 5000, true, false);
	}

	validar() {
		let valor = true;
		if ((this.password == "") || (this.password == undefined) || (this.password == null)) {
			Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (CONTRASEÑA) es obligatorio"
			})
			valor = false;
			return valor;
		}
		else if ((this.password2 == "") || (this.password2 == undefined) || (this.password2 == null)) {
			Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (VERIFICACION DE CONTRASEÑA) es obligatorio"
			})
			valor = false;
			return valor;
		}
	}
	guardar() {
		if (this.validar()) {
			if (this.password == this.password2) {
				let ruta = `user/` + this.id + `/update/password`;
				let data = {
					"password": this.password,
				}
				this._security.updateUser(data, ruta).subscribe((res: any) => {
					if (res == true) {
						Swal.fire({
							icon: 'success',
							title: 'Oops...',
							text: 'Contraseña actualizada con exito',
						})
					}
				});
			}
		}
	}
	cancelar() {
		this.matDialogRef.close();
	}

}
