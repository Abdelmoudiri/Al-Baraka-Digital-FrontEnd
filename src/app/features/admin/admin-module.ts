import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';


import { MainLayoutComponent } from '../../shared/layout/main-layout/main-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MainLayoutComponent
  ]
})
export class AdminModule { }
