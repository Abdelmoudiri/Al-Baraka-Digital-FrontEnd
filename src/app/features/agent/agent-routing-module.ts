import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layout/main-layout/main-layout';
import { AgentDashboard } from './dashboard/dashboard';
import { PendingOperationsComponent } from './pending/pending';
import { OperationDetailComponent } from './operation-detail/operation-detail';
import { AgentOperationsComponent } from './operations/operations';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: AgentDashboard },
      { path: 'pending', component: PendingOperationsComponent },
      { path: 'operations/:id', component: OperationDetailComponent },
      { path: 'operations', component: AgentOperationsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
