import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { SharedModule } from '../shared/shared.module';
import { InstalledModsComponent } from './installed-mods/installed-mods.component';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [
    InstalledModsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    MatListModule,
    MatTabsModule,
  ],
})
export class PagesModule {
}
