import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { NavigationComponent } from './navigation.component';
import { ItemComponent } from './item/item.component';
import { GroupComponent } from './group/group.component';
import { CollapsableComponent } from './collapsable/collapsable.component';

@NgModule({
  declarations: [
    NavigationComponent,
    ItemComponent,
    GroupComponent,
    CollapsableComponent
  ],
  imports: [SharedModule, RouterModule],
  exports: [NavigationComponent]
})
export class NavigationModule {}
