// Angular
import { Component, Input, OnInit } from '@angular/core';
// NGRX
import { Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilitiesService } from 'src/app/services/utility.service';
import { ChangeMyPasswordComponent } from 'src/app/views/pages/user-management/users/_subs/change-my-password/change-my-password.component';
import { MatDialog } from '@angular/material/dialog';
import { LayoutConfigService, ToggleOptions } from 'src/app/core/_base/layout';
import { HtmlClassService } from 'src/app/views/theme/html-class.service';

@Component({
  selector: 'kt-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {

  @Input() userDropdownStyle = 'light';
  @Input() avatar = true;
  @Input() greeting = true;
  @Input() badge: boolean;
  @Input() icon: boolean;
  infouser:string = '';
  name: string = '';
  lastname: string = '';

   // Public properties
   headerLogo = '';
   asideSelfDisplay = true;
   headerMenuSelfDisplay = true;
   headerMobileClasses = '';
 
   toggleOptions: ToggleOptions = {
     target: KTUtil.getBody(),
     targetState: 'topbar-mobile-on',
     toggleState: 'active'
   };
  
   constructor(private store: Store<AppState>, private _auth:AuthenticationService, private _matDialog: MatDialog, private uti:UtilitiesService, private layoutConfigService: LayoutConfigService, private uiService: HtmlClassService) {

  }

  ngOnInit(): void {
    this.name = this.uti.getSession('name');
    this.lastname = this.uti.getSession('lastName');
    this.infouser = this.GetName();
    
    this.headerMobileClasses = this.uiService.getClasses('header_mobile', true).toString();
    this.asideSelfDisplay = this.layoutConfigService.getConfig('aside.self.display');
    this.headerMenuSelfDisplay = this.layoutConfigService.getConfig('header.menu.self.display');
  }

  logout() {
    this._auth.destroySession();
  }

  GetName(): string {
    if ((this.name == "") || (this.name == undefined) || (this.name == null))
			this.name = "";

    if ((this.lastname == "") || (this.lastname == undefined) || (this.lastname == null))
        this.lastname = "";

    if (this.name != "" && this.lastname != "")
      return `${ this.name } ${ this.lastname }`;

    if (this.name != "")
      return `${ this.name }`;

    if (this.lastname != "")
      return `${ this.lastname }`;

    return "";
  }

  LetterInitial(name) {
    if (this.name != "" && this.lastname != "")
      return `${ this.name.substring(0, 1) } ${ this.lastname.substring(0, 1) }`;

    if (this.name != "")
      return `${ this.name.substring(0, 1) }`;

    if (this.lastname != "")
      return `${ this.lastname.substring(0, 1) }`;

    return name.substring(1, 2)
  }

  openModalMyPassword(): void {
		const dialogRef = this._matDialog.open(ChangeMyPasswordComponent, { width: '35em', height: '26em', });

		dialogRef.afterClosed().subscribe(result => {
		
		});
	}

}
