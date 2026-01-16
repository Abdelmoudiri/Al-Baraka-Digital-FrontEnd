import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { MainLayoutComponent } from '../../shared/layout/main-layout/main-layout';
import { Agents } from './agents/agents';
import { AddAgent } from './agents/add-agent/add-agent';
import { UsersComponent } from './users/users';
import { OperationsComponent } from './operations/operations';
import { AiStatsComponent } from './ai-stats/ai-stats';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'agents', component: Agents },
      { path: 'agents/new', component: AddAgent },
      { path: 'users', component: UsersComponent },
      { path: 'operations', component: OperationsComponent },
      { path: 'ai-stats', component: AiStatsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
