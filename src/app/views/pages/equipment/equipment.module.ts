// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from 'src/app/core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { EquipmentComponent } from 'src/app/views/pages/equipment/equipment.component';
import { CategoryListComponent } from 'src/app/views/pages/equipment/category/list.component';
import { CategoryFormComponent } from 'src/app/views/pages/equipment/category/form.component';
import { BrandListComponent } from 'src/app/views/pages/equipment/brand/list.component';
import { BrandFormComponent } from 'src/app/views/pages/equipment/brand/form.component';
import { ProductListComponent } from 'src/app/views/pages/equipment/product/list.component';
import { ProductFormComponent } from 'src/app/views/pages/equipment/product/form.component';
import { FoodListComponent } from 'src/app/views/pages/equipment/food/list.component';
import { FoodFormComponent } from 'src/app/views/pages/equipment/food/form.component';
// Material
import { usersReducer, UserEffects } from '../../../core/auth';
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

const routes: Routes = [
	{
		path: '',
		component: EquipmentComponent,
		children: [
			{ path: '', redirectTo: 'category', pathMatch: 'full' },
			{ path: 'category', component: CategoryListComponent },
			{ path: 'category/create', component: CategoryFormComponent },
			{ path: 'category/edit/:id', component: CategoryFormComponent },
			{ path: 'brand', component: BrandListComponent },
			{ path: 'brand/create', component: BrandFormComponent },
			{ path: 'brand/edit/:id', component: BrandFormComponent },
			{ path: 'product', component: ProductListComponent },
			{ path: 'product/create', component: ProductFormComponent },
			{ path: 'product/edit/:id', component: ProductFormComponent },
			{ path: 'food', component: FoodListComponent },
			{ path: 'food/create', component: FoodFormComponent },
			{ path: 'food/edit/:id', component: FoodFormComponent },
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
		ActionNotificationComponent
	],
	declarations: [
		EquipmentComponent,
		CategoryListComponent,
		CategoryFormComponent,
		BrandListComponent,
		BrandFormComponent,
		ProductListComponent,
		ProductFormComponent,
		FoodListComponent,
		FoodFormComponent,
	]
})

export class EquipmentModule {

}
