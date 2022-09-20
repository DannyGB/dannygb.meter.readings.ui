import { NgModule } from '@angular/core';
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
import { FormsModule } from '@angular/forms'; 
import { NewReadingDialog } from './new-reading/new-reading.component';

@NgModule({
  declarations: [  
    ReadingsComponent,  
    ReadingListComponent,
    NewReadingDialog
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
  ],
  providers: [
    
  ]  
})
export class ReadingsModule { }
