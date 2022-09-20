import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReadingsService } from '../readings.service';
import { addReading, retrievedReadingList } from '../state/readings.actions';
import { selectReadings } from '../state/readings.selectors';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Reading } from '../readings.model';
import { BehaviorSubject, Subject, zip, } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewReadingDialog } from '../new-reading/new-reading.component';
import { UUID } from 'angular2-uuid';

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
  public columnsToDisplay = ['reading', 'readingdate'];
  public pageSizeOptions = [5, 10, 20];
  public dataSource!: MatTableDataSource<Reading>;
  public pageSize = this.initialPageSize;
  public skip: number = 0;
  public totalReadings$: Subject<number> = new Subject<number>();
  public pageEvent$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(
  {
    length: 0,
    pageIndex: 0,
    pageSize: this.initialPageSize
  });
  
  private lastPage!: number;
  
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
      this.readings = data;
    });

    this.totalReadings$.subscribe(val => {
      this.lastPage = Math.ceil(val / this.pageSize)-1;
    });
  }
  
  public addNewReading(): void {

    this.pageEvent$.next({
      length: 0,
      pageIndex:this.lastPage,
      pageSize: this.pageSize
    });

    const dialogRef = this.dialog.open(NewReadingDialog, {
      width: "250px",
      data: { reading: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      const reading: Reading = {
        _id: UUID.UUID(),
        reading: result,
        readingdate: new Date().toISOString()
      };

      if(reading.reading >= 0) { // TODO: Validation
        this.readingsService.addReading(reading).subscribe((location: any) => {
          console.log(location);
          this.store.dispatch(addReading({reading}))
        });
      }
    });
  }  

  public onChangePage(pe: PageEvent): void {
    this.pageSize = pe.pageSize;
    this.pageEvent$.next(pe);    
  }

  private getReadings(): void {
    this.pageEvent$.subscribe((pe: PageEvent) => {
      zip(
        this.readingsService.getReadings(this.getSkip(pe), pe.pageSize),
        this.readingsService.getReadingCount()
      )
      .subscribe(val => {
        this.totalReadings$.next(val[1]);
        this.store.dispatch(retrievedReadingList({ readings: val[0] }))
      });
    });
  }

  private getSkip(pe: PageEvent): number { return pe.pageIndex * pe.pageSize; }
}
