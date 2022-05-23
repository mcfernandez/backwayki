// Angular
import { Component, OnInit, ChangeDetectionStrategy, Input, Inject } from '@angular/core';
import { AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
// RxJS
import { BehaviorSubject } from 'rxjs';
// NGRX
import { Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// Auth
import { AuthService, UserUpdated, User } from '../../../../../../core/auth/';
// State
import { AppState } from '../../../../../../core/reducers';
// Layout
import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

export class PasswordValidation {
	/**
	 * MatchPassword
	 *
	 * @param AC: AbstractControl
	 */
	static MatchPassword(AC: AbstractControl) {
		const password = AC.get('password').value; // to get value in input tag
		const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
		if (password !== confirmPassword) {
			AC.get('confirmPassword').setErrors({ MatchPassword: true });
		} else {
			return null;
		}
	}
}

@Component({
	selector: 'kt-change-password',
	templateUrl: './change-password.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
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
		public matDialogRef: MatDialogRef<ChangePasswordComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private layoutUtilsService: LayoutUtilsService) {
	}


	ngOnInit() {
		this.id = this.data.id;
		this.name = this.data.name;
		this.lastname = this.data.lastname;
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
		}
		return valor;
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
					this.layoutUtilsService.showActionNotification('Se Actualizo con exito', MessageType.Update);
					this.matDialogRef.close();
				}
			});
		}
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: "Las contraseñas no coinciden"
			})
		}
	}
	cancelar() {
		this.matDialogRef.close();
	}

}
