import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SecurityService } from 'src/app/services/security.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-createnotification',
  templateUrl: './createnotification.component.html'
})
export class CreateNotificationComponent implements OnInit {

	role_Reservation = "B46DD5EC-FA60-4F65-A13B-562BC008392B";

	bookingid: string = "";
	observation: string = "";
	userid: string = "";

	listUser: any[] = [];

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
    	private layoutUtilsService: LayoutUtilsService,
    	public matDialogRef: MatDialogRef<CreateNotificationComponent>,
    	private _security: SecurityService,
		private _commonService: CommonService) {
		this.bookingid = data.bookingid;
	}

	ngOnInit(): void {
		this._commonService.List(`user/listbyrole/${ this.role_Reservation }`).subscribe((result: any[]) => {
			this.listUser = result;
			
			this.listUser.unshift({ value: "", label: "-- seleccione una opción --", status: true });
		});
	}

	guardar() {
        if ((this.bookingid == "") || (this.bookingid == undefined) || (this.bookingid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "Debe seleccionar la reserva..." });

			return;
		}

        if ((this.userid == "") || (this.userid == undefined) || (this.userid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "Debe seleccionar al personal de reserva..." });

			return;
		}

        if ((this.observation == "") || (this.observation == undefined) || (this.observation == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "Debe ingresar la observación..." });

			return;
		}
		
		var data = { bookingid: this.bookingid, userreservationid: this.userid, observation: this.observation };

		this._commonService.Create(`notification/create`, data).subscribe((result: any) => {
			if (result) {						
				this.layoutUtilsService.showActionNotification('Se creo la notificación', MessageType.Update);
				this.matDialogRef.close();
			}
		});
	}

	cerrar() {
		this.matDialogRef.close();
	}

}
