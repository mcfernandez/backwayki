// Angular
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-advisercreate',
	templateUrl: './create.component.html'
})

export class AdviserCreateComponent implements OnInit {
	listUser: any = [];
	userid: string = "";

	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		public matDialogRef: MatDialogRef<AdviserCreateComponent>,
		private layoutUtilsService: LayoutUtilsService,
		private _commonService: CommonService) { 

	}

	ngOnInit() {
		this.getListUser();
	}

	guardar() {
		if (this.userid == "") {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: "Seleccione un usuario"
			});

			return;
		}
		
		let ruta = `adviser/add/${ this.userid }`;
				
		this._commonService.Create(ruta, {}).subscribe((res: any) => {
			if (res == true) {
				this.layoutUtilsService.showActionNotification('Se creo el asesor', MessageType.Update);
				this.matDialogRef.close();
			}
		});
	}

	cancelar(){
		this.matDialogRef.close();
	}

	getListUser() {
		this._commonService.List(`adviser/listuser`).subscribe((result: any) => {
			this.listUser = result;
		});
	}

}
