import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReadingsComponent } from './readings.component';
import { StoreModule } from '@ngrx/store';
import { ReadingsRoutingModule } from './readings-routing.module';

import { readingsReducer } from './state/readings.reducer';
import { HttpClientModule } from '@angular/common/http';
import { ReadingListComponent } from './reading-list/reading-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { FormsModule } from '@angular/forms'; 
import { NewReadingDialog } from './new-reading/new-reading.component';
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { DeleteReadingComponent } from './delete-reading/delete-reading.component';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card'; 
import { ChartModule } from 'primeng/chart';
import { ReadingChartComponent } from './reading-chart/reading-chart.component';
import { ReadingPieChartComponent } from './reading-chart/reading-pie-chart/reading-pie-chart.component';
import { ReadingLineChartComponent } from './reading-chart/reading-line-chart/reading-line-chart.component'; 

@NgModule({
  declarations: [  
    ReadingsComponent,  
    ReadingListComponent,
    NewReadingDialog,
    DeleteReadingComponent,
    ReadingChartComponent,
    ReadingPieChartComponent,
    ReadingLineChartComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ readings: readingsReducer }),
    HttpClientModule,
    ReadingsRoutingModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSortModule,
    MatRadioModule,
    MatCardModule,
    ChartModule
  ],
  providers: [
    MatDatepickerModule,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}    
  ]  
})
export class ReadingsModule { }
