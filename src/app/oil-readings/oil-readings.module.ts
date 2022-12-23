import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OilReadingsListComponent } from './oil-readings-list/oil-readings-list.component';
import { OilReadingsRoutingModule } from './oil-readings-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms'; 
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NewOilReadingDialog } from './new-oil-reading/new-oil-reading.component';
import { OilReadingChartComponent } from './oil-reading-chart/oil-reading-chart.component';
import { SharedUiComponentsModule } from '../shared/components/shared-ui-components/shared-ui-components.module';
import { EditOilReadingComponent } from './edit-oil-reading/edit-oil-reading.component';


@NgModule({
  declarations: [
    OilReadingsListComponent,
    NewOilReadingDialog,
    OilReadingChartComponent,
    EditOilReadingComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    OilReadingsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatGridListModule,
    SharedUiComponentsModule,
  ],
  providers: [
    MatDatepickerModule,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}    
  ]
})
export class OilReadingsModule { }
