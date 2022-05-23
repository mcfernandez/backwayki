import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
})
export class BookingResumeComponent implements OnInit {

	_pathservice: string = "booking";
	_pathurl: string = "/sale/bookings";
	_entityname: string = "reserva";
	entityname: string = "";
  entity: any = null;

  total_passengers: number = 0;
  total_hotels: number = 0;
  total_Servicios_adicionales: number = 0;
  total_otherTours: number = 0;
  total_buys: number = 0;
  total_payments: number = 0;
  total_substract: number = 0;
  total_add: number = 0;

  selectedTab: number = 0;
  title: string = "Resumen";

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private _commonService: CommonService) { 

  }

  ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			var isok = false;
			var paths = this.router.url.split("/");			

			if (paths.length == 5 && paths[3] == "resume")
				isok = this.setData(paths[4], null);

			if (!(isok)) {
				Swal.fire({ icon: 'error', title: 'Error', text: `Información no válida del ${ this._entityname }` })

				this.router.navigate([this._pathurl], { relativeTo: this.activatedRoute });
			}
		});  
  }

	setData(id: string, resultrefresh: any = null) {
		var result = JSON.parse(localStorage.getItem(`${ this._pathservice }-${ id }`));

		if (resultrefresh != null) {
			result = resultrefresh;
			localStorage.setItem(`${ this._pathservice }-${ id}`, JSON.stringify(result));
		}

		if (result == null)
			return false;
		
		this.entity = result;

    this.entity.passanger.forEach( (element) => {
      this.total_passengers += element.total;
    });

    this.entity.hotels.forEach( (element) => {
      this.total_hotels += element.total;
    });

    this.entity.additionalServices.forEach( (element) => {
      this.total_Servicios_adicionales += element.total;
    });

    this.entity.otherTours.forEach( (element) => {
      this.total_otherTours += element.total;
    });

    this.entity.buy.forEach( (element) => {
      this.total_buys += element.total;
    });

    this.entity.payments.forEach( (element) => {
      this.total_payments += element.total;
    });

    this.entity.paymentExtra.substract.forEach( (element) => {
      this.total_substract += element.total;
    });

    this.entity.paymentExtra.add.forEach( (element) => {
      this.total_add += element.total;
    });
    
		return true;
	}

	GetTitle() {
		return `Resumen`;
	}

  setClientEdit(clientid: string) {
    if (clientid != null) {
      this._commonService.Get(`client/${ clientid }`).subscribe((result: any) => {
        localStorage.setItem(`client-${ clientid}`, JSON.stringify(result));
        
        this.router.navigate([`/administration/clients/view`, clientid], { relativeTo: this.activatedRoute });
      });
    }
  }

  getPDF() {
    console.log(this.entity.booking.id);
    
    this._commonService.Get(`booking/${ this.entity.booking.id }/resumepdf`).subscribe((result: any) => {
      console.log(result);

      if (result.ok) {
        const source = `data:application/pdf;base64,${ result.data }`;
        const link = document.createElement("a");
        link.href = source;
        link.download = `resume.pdf`
        link.click();
      }
    });
  }

}
