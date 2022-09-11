import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { WebviewDirective } from './directives/';
import { ModViewerComponent } from './components/mod-viewer/mod-viewer.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    HeaderBarComponent,
    ModViewerComponent ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    TranslateModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    HeaderBarComponent,
    ModViewerComponent,
  ],
})
export class SharedModule {
}
