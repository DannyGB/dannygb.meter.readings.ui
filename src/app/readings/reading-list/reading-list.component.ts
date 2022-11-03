import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReadingsService } from '../readings.service';
import { addReading, removeReading } from '../state/readings.actions';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Reading } from '../readings.model';
import { MatDialog } from '@angular/material/dialog';
import { NewReadingDialog } from '../new-reading/new-reading.component';
import { UUID } from 'angular2-uuid';
import { DeleteReadingComponent } from '../delete-reading/delete-reading.component';
import { ReadingDataSource } from '../reading.datasource';

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
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.dataSource = new ReadingDataSource(this.readingsService, this.store);
    this.dataSource.loadData();
  }

  public addNewReading(): void {

    const dialogRef = this.dialog.open(NewReadingDialog, {
      width: "300px",
      data: { 
        reading: {           
          readingdate: new Date().toISOString() },
          lastReading: this.dataSource.data.length ? this.dataSource.data[0].reading : 0,
          rate: "Day"
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      const reading: Reading = {
        _id: UUID.UUID(),
        reading: Number(result.reading),
        readingdate: result.readingdate,
        note: result.note,
        rate: result.rate
      };

      if(reading.reading > 0) { // TODO: Validation
        this.readingsService.addReading(reading).subscribe((location: any) => {
          console.log(location);
          this.store.dispatch(addReading({reading}));
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
