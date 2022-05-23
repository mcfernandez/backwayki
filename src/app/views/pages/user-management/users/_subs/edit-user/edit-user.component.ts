import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  //Las vairbales
  name: "";
  lastname: "";
  email: "";
  mobile: "";
  phone: "";
  id: any;
  nickname: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private layoutUtilsService: LayoutUtilsService,
    public matDialogRef: MatDialogRef<EditUserComponent>,
    private _security: SecurityService,
  ) { }
  estados = [
		{ value: '', viewValue: 'Seleccion' },
		{ value: 'true', viewValue: 'Activo' },
		{ value: 'false', viewValue: 'Desactivo' }
	];

  ngOnInit(): void {
    console.log(this.data)
    //Las vairbales
    this.id = this.data.id;
    this.name = this.data.name;
    this.lastname = this.data.lastname;
    this.email = this.data.email;
    this.mobile = this.data.mobile;
    this.phone = this.data.phone;
    this.nickname = this.data.nickname;
  }
	validar() {
		let valor = true;
		if ((this.name == "")||(this.name==undefined)||(this.name==null)){
				Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (NOMBRES) es obligatorio"
			})
			valor = false;
			return valor;
		}
		else if ((this.lastname == "")||(this.lastname==undefined)||(this.lastname==null)) {
				Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (APELLIDOS) es obligatorio"
			})
			valor = false;
			return valor;
		}
		else if ((this.email == "")||(this.email==undefined)||(this.email==null)) {
				Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (EMAIL) es obligatorio"
			})
			valor = false;
			return valor;
		}
		else if ((this.mobile == "")||(this.mobile==undefined)||(this.mobile==null)) {
				Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (CELULAR) es obligatorio"
			})
			valor = false;
			return valor;
		}
		/*else if ((this.phone == "")||(this.phone==undefined)||(this.phone==null)) {
				Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (TELEFONO) es obligatorio"
			})
			valor = false;
			return valor;
		}*/
		else if ((this.nickname == "")||(this.nickname==undefined)||(this.nickname==null)) {
				Swal.fire({
				icon: 'warning',
				title: 'Campo Obligatorio',
				text: "El campo (USUARIO) es obligatorio"
			})
			valor = false;
			return valor;
		}
		return valor;
	}
  guardar() {
    if (this.validar()) {
      let ruta=`user/`+this.id+`/update`;
      let data = {
        "name": this.name,
        "lastname": this.lastname,
        "email": this.email,
        "mobile": this.mobile,
        "phone": this.phone,
        "nickname":this.nickname,
      }
      this._security.updateUser(data, ruta).subscribe((res: any) => {
        if (res == true) {
          this.layoutUtilsService.showActionNotification('Se Actualizo con exito', MessageType.Update);
          this.matDialogRef.close();

        }
      });
    }
    
  }
  cancelar(){
		this.matDialogRef.close();
	}

}
