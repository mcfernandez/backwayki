// Angular
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'kt-dashboardbooking',
	templateUrl: './booking.component.html'
})

export class DashboardBookingComponent implements OnInit {
	listAdviser: any = [];
	adviserid: string = "";
	bookingid: string = "";
	type: string = "";

	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		public matDialogRef: MatDialogRef<DashboardBookingComponent>,
		private layoutUtilsService: LayoutUtilsService,
		private _commonService: CommonService) { 
		this.bookingid = data.bookingid;
		this.type = data.type;
	}

	ngOnInit() {
		this.getListUser();
	}

	guardar() {
		if (this.adviserid == "") {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: "Seleccione un asesor de venta"
			});

			return;
		}
		
		let ruta = `booking/assignadviser`;

		if (this.type == "incident")
		  ruta = `incident/assignadviser`;

		this._commonService.Update(ruta, { id: this.bookingid, adviserid: this.adviserid }).subscribe((res: any) => {
			if (res == true) {
				this.layoutUtilsService.showActionNotification('Se asigno el asesor', MessageType.Update);
				this.matDialogRef.close();
			}
		});
	}

	cancelar(){
		this.matDialogRef.close();
	}

	getListUser() {
		this._commonService.List(`adviser/list`).subscribe((result: any) => {
			this.listAdviser = result;
		});
	}

}
