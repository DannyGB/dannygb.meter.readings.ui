import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPanelComponent } from './number-panel/number-panel.component';
import { LoadingRippleComponent } from './loading-ripple/loading-ripple.component';
import { SimplePopupComponent } from './simple-popup/simple-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import {  MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    NumberPanelComponent,
    LoadingRippleComponent,
    SimplePopupComponent
  ],
  exports: [
    NumberPanelComponent,
    LoadingRippleComponent,
    SimplePopupComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ]
})
export class SharedUiComponentsModule { }
