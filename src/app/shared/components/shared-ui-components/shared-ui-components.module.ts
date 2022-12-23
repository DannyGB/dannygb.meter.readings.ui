import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPanelComponent } from './number-panel/number-panel.component';
import { LoadingRippleComponent } from './loading-ripple/loading-ripple.component';
import { SimplePopupComponent } from './simple-popup/simple-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import {  MatButtonModule } from '@angular/material/button';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { ChartModule } from 'primeng/chart';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    NumberPanelComponent,
    LoadingRippleComponent,
    SimplePopupComponent,
    LineChartComponent,
    PieChartComponent
  ],
  exports: [
    NumberPanelComponent,
    LoadingRippleComponent,
    SimplePopupComponent,
    LineChartComponent,
    PieChartComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ChartModule,
  ]
})
export class SharedUiComponentsModule { }
