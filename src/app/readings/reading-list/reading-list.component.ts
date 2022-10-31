import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReadingsService } from '../readings.service';
import { addReading, retrievedReadingList, removeReading } from '../state/readings.actions';
import { selectReadings } from '../state/readings.selectors';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Reading } from '../readings.model';
import { BehaviorSubject, combineLatestWith, first, Subject, withLatestFrom, zip, } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewReadingDialog } from '../new-reading/new-reading.component';
import { UUID } from 'angular2-uuid';
import { DeleteReadingComponent } from '../delete-reading/delete-reading.component';

export interface SortEvent {
  direction: string,
}

@Component({
  selector: 'app-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.css']
})
export class ReadingListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  private initialPageSize = 5;
  public readings: Reading[] = [];
  public columnsToDisplay = ['reading', 'readingdate', 'note', 'id'];
  public pageSizeOptions = [5, 10, 20];
  public dataSource!: MatTableDataSource<Reading>;
  public pageSize = this.initialPageSize;
  public skip: number = 0;
  public sortDirection: string = "desc";
  public totalReadings$: Subject<number> = new Subject<number>();  
  public pageEvent$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(
  {
    length: 0,
    pageIndex: 0,
    pageSize: this.initialPageSize
  });
  public sortEvent$: BehaviorSubject<SortEvent> = new BehaviorSubject<SortEvent>(
  {
    direction: this.sortDirection
  });
  
  private lastPage!: number;
  private loadComplete$: Subject<void> = new Subject<void>();
  
  constructor(
    private readingsService: ReadingsService,
    private store: Store,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.getReadings();
  }

  public ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Reading>(this.readings);
    this.store.select(selectReadings).subscribe((data: Reading[]) => {
      this.readings = [...data];
    });

    this.totalReadings$.subscribe(val => {
      this.lastPage = Math.ceil(val / this.pageSize)-1;
    });
  }
  
  public addNewReading(): void {

    const dialogRef = this.dialog.open(NewReadingDialog, {
      width: "300px",
      data: { reading: { reading: 0, readingdate: new Date().toISOString() }, lastReading: this.readings[0].reading }
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
    this.sortEvent$.next({ direction: event.direction});
  }

  public onChangePage(pe: PageEvent): void {
    this.pageSize = pe.pageSize;
    this.pageEvent$.next(pe);
  }

  private getReadings(): void {
    this.pageEvent$.pipe(combineLatestWith(this.sortEvent$))
    .subscribe((pe: any) => {
      zip(
        this.readingsService.getReadings(this.getSkip(pe[0]), pe[0].pageSize, pe[1].direction),
        this.readingsService.getReadingCount()
      )
      .subscribe(val => {
        this.totalReadings$.next(val[1]);
        this.store.dispatch(retrievedReadingList({ readings: val[0] }))
        this.loadComplete$.next();
      });
    });
  }

  private getSkip(pe: PageEvent): number { return pe.pageIndex * pe.pageSize; }
}
