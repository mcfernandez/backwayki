import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SecurityService } from 'src/app/services/security.service';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'kt-updatedate',
  templateUrl: './updatedate.component.html'
})
export class UpdateDateComponent implements OnInit {

	bookingid: string = "";
	startdate: any = null;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
    	private layoutUtilsService: LayoutUtilsService,
    	public matDialogRef: MatDialogRef<UpdateDateComponent>,
    	private _security: SecurityService,
		private _commonService: CommonService) {
		this.bookingid = data.bookingid;
	}

	ngOnInit(): void {
		
	}

	guardar() {
        if ((this.bookingid == "") || (this.bookingid == undefined) || (this.bookingid == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "Debe seleccionar la reserva..." });

			return;
		}

        if ((this.startdate == null)) {
			Swal.fire({ icon: 'warning', title: 'Campo Obligatorio', text: "Debe seleccionar la fecha..." });

			return;
		}
		
		var data = { date: this.startdate };

		this._commonService.Update(`booking/${ this.bookingid }/changedate`, data).subscribe((result: any) => {
			if (result) {						
				this.layoutUtilsService.showActionNotification('Se actualizo la fecha de inicio', MessageType.Update);
				this.matDialogRef.close();
			}
		});
	}

	cerrar() {
		this.matDialogRef.close();
	}

}
