import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'kt-module-edit',
  templateUrl: './module-edit.component.html',
  styleUrls: ['./module-edit.component.scss']
})
export class ModuleEditComponent implements OnInit {
  module_list: any;

  constructor(private _security: SecurityService,
		public matDialogRef: MatDialogRef<ModuleEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private layoutUtilsService: LayoutUtilsService) { }

  ngOnInit(): void {
    this.getModules()
  }
  getModules(){
		let url: string = `module`;
		this._security.getList(url).subscribe((value: any) => {
			this.module_list = value;
		});
	}


  guardar(){
    for (let i=0; i<this.module_list.length; i++) {
      let x = 0;
      if(this.module_list[i].subitems != null){
        for (const item of this.module_list[i].subitems) {
          if(item.status == true){
            x = 1;
            break;
          }
        }
      }else{
        if(this.module_list[i].status == true){
          x = 1;
        }
      }
      if(x == 0){
        this.module_list[i].status = false;
      }else{
        this.module_list[i].status = true;
      }
    }
    let data = {
      "jsonMenu": JSON.stringify(this.module_list)
    } 
    console.log(data); 
    this._security.posModule(this.data.id, data).subscribe((res2: any) => {
      if (res2 == true) {
        this.layoutUtilsService.showActionNotification('Se Actualizo con exito el Rol', MessageType.Update);
        this.matDialogRef.close();
      }
    });
  }

  cancelar(){
		this.matDialogRef.close();
	}
}
