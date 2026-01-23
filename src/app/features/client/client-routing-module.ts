import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layout/main-layout/main-layout';
import { ClientDashboard } from './dashboard/dashboard';
import { ClientProfileComponent } from './profile/profile';
import { DepositComponent } from './deposit/deposit';
import { WithdrawalComponent } from './withdrawal/withdrawal';
import { TransferComponent } from './transfer/transfer';
import { OperationsComponent } from './operations/operations';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: ClientDashboard },
      { path: 'profile', component: ClientProfileComponent },
      { path: 'deposit', component: DepositComponent },
      { path: 'withdrawal', component: WithdrawalComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'operations', component: OperationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
