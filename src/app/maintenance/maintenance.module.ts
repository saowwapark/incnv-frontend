import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionComponent } from './version/version.component';
import { MaterialModule } from '../material.module';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [VersionComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MaintenanceRoutingModule,
    SharedModule
  ]
})
export class MaintenanceModule {}
