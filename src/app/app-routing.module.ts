import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
// Auth
import { AuthGuard } from './core/auth';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)},
  { path: 'error', loadChildren: () => import('./views/pages/error/error.module').then(m => m.ErrorModule)},
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'management',
        loadChildren: () => import('src/app/views/pages/management/management.module').then(m => m.ManagementModule),
      },
      {
        path: 'administration',
        loadChildren: () => import('src/app/views/pages/administration/administration.module').then(m => m.AdministrationModule),
      },
      {
        path: 'sale',
        loadChildren: () => import('src/app/views/pages/sale/sale.module').then(m => m.SaleModule),
      },
      {
        path: 'incidents',
        loadChildren: () => import('src/app/views/pages/incident/incident.module').then(m => m.IncidentModule),
      },
      {
        path: 'operation',
        loadChildren: () => import('src/app/views/pages/operation/operation.module').then(m => m.OperationModule),
      },
      {
        path: 'accounting',
        loadChildren: () => import('src/app/views/pages/accounting/accounting.module').then(m => m.AccountingModule),
      },
      {
        path: 'finance',
        loadChildren: () => import('src/app/views/pages/finance/finance.module').then(m => m.FinanceModule),
      },
      {
        path: 'equipment',
        loadChildren: () => import('src/app/views/pages/equipment/equipment.module').then(m => m.EquipmentModule),
      },
      {
        path: 'security',
        loadChildren: () => import('./views/pages/user-management/user-management.module').then(m => m.UserManagementModule),
      },
      
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
    ],
  },
  {
    path: '**', 
    redirectTo: 'error/403', 
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forRoot(routes,{ useHash: true }),
  ],
  exports: [ RouterModule ],
})

export class AppRoutingModule {

}
