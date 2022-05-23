import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';

import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from 'src/app/core/_base/crud';
import { usersReducer, UserEffects } from 'src/app/core/auth';
import { PartialsModule } from 'src/app/views/partials/partials.module';
import { ActionNotificationComponent } from 'src/app/views/partials/content/crud';

import { AdministrationComponent } from 'src/app/views/pages/administration/administration.component';
import { TourListComponent } from 'src/app/views/pages/administration/tours/list.component';
import { TourFormComponent } from 'src/app/views/pages/administration/tours/form.component';
import { ClientListComponent } from 'src/app/views/pages/administration/clients/list.component';
import { ClientFormComponent } from 'src/app/views/pages/administration/clients/form.component';
import { AdviserListComponent } from 'src/app/views/pages/administration/advisers/list.component';
import { AdviserCreateComponent } from 'src/app/views/pages/administration/advisers/create.component';
import { CorporateClientListComponent } from 'src/app/views/pages/administration/corporateclient/list.component';
import { CorporateClientFormComponent } from 'src/app/views/pages/administration/corporateclient/form.component';
import { HotelListComponent } from 'src/app/views/pages/administration/hotel/list.component';
import { HotelFormComponent } from 'src/app/views/pages/administration/hotel/form.component';


const routes: Routes = [
	{
		path: '',
		component: AdministrationComponent,
		children: [
			{ path: '', redirectTo: 'tours', pathMatch: 'full' },
			{ path: 'tours', component: TourListComponent },
			{ path: 'tours/create', component: TourFormComponent },
			{ path: 'tours/edit/:id', component: TourFormComponent },
			{ path: 'clients', component: ClientListComponent },
			{ path: 'clients/view/:id', component: ClientFormComponent },
			{ path: 'advisers', component: AdviserListComponent },
			{ path: 'corporateclient', component: CorporateClientListComponent },
			{ path: 'corporateclient/create', component: CorporateClientFormComponent },
			{ path: 'corporateclient/edit/:id', component: CorporateClientFormComponent },
			{ path: 'hotel', component: HotelListComponent },
			{ path: 'hotel/create', component: HotelFormComponent },
			{ path: 'hotel/edit/:id', component: HotelFormComponent },
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('users', usersReducer),
    	EffectsModule.forFeature([UserEffects]),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
    	MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule
	],
	providers: [
		InterceptService,
		{
      		provide: HTTP_INTERCEPTORS,
      		useClass: InterceptService,
      		multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		AdviserCreateComponent
	],
	declarations: [
		AdministrationComponent,
		TourListComponent,
		TourFormComponent,
		ClientListComponent,
		ClientFormComponent,
		AdviserListComponent,
		AdviserCreateComponent,
		CorporateClientListComponent,
		CorporateClientFormComponent,
		HotelListComponent,
		HotelFormComponent
	]
})

export class AdministrationModule {

}
