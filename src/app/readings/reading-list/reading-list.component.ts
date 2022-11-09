import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReadingsService } from '../readings.service';
import { addReading, removeReading } from '../state/readings.actions';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Reading } from '../readings.model';
import { MatDialog } from '@angular/material/dialog';
import { NewReadingData, NewReadingDialog } from '../new-reading/new-reading.component';
import { UUID } from 'angular2-uuid';
import { DeleteReadingComponent } from '../delete-reading/delete-reading.component';
import { ReadingDataSource } from '../reading.datasource';
import { filter, zipWith } from 'rxjs';
import * as moment from 'moment';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';

@Component({
  selector: 'app-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.css']
})
export class ReadingListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  private initialPageSize = 50;
  public pageSize = this.initialPageSize;
  public columnsToDisplay = ['rate', 'reading', 'readingdate', 'note', 'delete'];
  public pageSizeOptions = [5, 10, 20, 50];
  public dataSource!: ReadingDataSource;
  public chartVisible = true;

  
  constructor(
    private readingsService: ReadingsService,
    private store: Store,
    private dialog: MatDialog,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  public ngOnInit(): void {
    this.dataSource = new ReadingDataSource(this.readingsService, this.store);
    this.dataSource.loadData();
  }

  public addNewReading(): void {

    const dialogRef = this.dialog.open(NewReadingDialog, {
      width: "500px",
      data: { 
        dayReading: {
          readingdate: moment()
        },
        nightReading: {},
        lastDayReading: this.readingsService.getLastDayReading(this.dataSource.data),
        lastNightReading: this.readingsService.getLastNightReading(this.dataSource.data),
      }
    });

    dialogRef.afterClosed().subscribe((result: NewReadingData) => {
      if(!result) {
        return;
      }

      const dayReading: Reading = {
        _id: UUID.UUID(),
        reading: Number(result.dayReading.reading),
        readingdate: result.dayReading.readingdate.startOf('day'),
        note: result.dayReading.note,
        rate: "Day"
      };

      const nightReading: Reading = {
        _id: UUID.UUID(),
        reading: Number(result.nightReading.reading),
        readingdate: result.dayReading.readingdate.startOf('day'),
        note: result.dayReading.note,
        rate: "Night"
      };

      if(dayReading.reading > 0 && nightReading.reading > 0) { // TODO: Validation
        this.readingsService.addReading(dayReading)
          .pipe(zipWith(this.readingsService.addReading(nightReading)))
          .subscribe((location: any) => {
            this.store.dispatch(addReading({ reading: dayReading }));
            this.store.dispatch(addReading({ reading: nightReading }));
        });
      }
    });
  }

  public deleteReading(id: string) {

    const dialogRef = this.dialog.open(DeleteReadingComponent, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.readingsService.deleteReading(id).subscribe((location: any) => {
          this.store.dispatch(removeReading({readingId: id}))
        });
      }
    });
  }

  public onSortChange(event: any): void {
    this.dataSource.sortEvent$.next({ direction: event.direction});
  }

  public onChangePage(pe: PageEvent): void {
    this.dataSource.pageEvent$.next(pe);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterEvent$.next({ filterText: filterValue });
  }

  public toggleChart(): void {
    this.chartVisible = !this.chartVisible;
  }  
}
