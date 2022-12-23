import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReadingsForecastService } from '../readings-forecast.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Reading } from '../models/reading.model';
import { MatDialog } from '@angular/material/dialog';
import { NewReadingData, NewReadingDialog } from '../new-reading/new-reading.component';
import { UUID } from 'angular2-uuid';
import { DeleteReadingComponent } from '../delete-reading/delete-reading.component';
import { ReadingDataSource } from '../reading.datasource';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { UserService } from 'src/app/login/user.service';
import { User } from 'src/app/login/models/user.model';
import { ReadingListService } from './reading-list.service';
import { EditReadingComponent } from '../edit-reading/edit-reading.component';

@Component({
  selector: 'app-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.css']
})
export class ReadingListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  private initialPageSize = 50;
  public pageSize = this.initialPageSize;
  public columnsToDisplay = ['rate', 'reading', 'readingdate', 'userName', 'note', 'edit', 'delete'];
  public pageSizeOptions = [5, 10, 20, 50];
  public dataSource!: ReadingDataSource;
  public chartVisible = true;
  public user?: User;
  private destroy$: Subject<void> = new Subject<void>();
  public forecastApplied: boolean = false;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private forecastService: ReadingsForecastService,
    public readingListService: ReadingListService,
    private dialog: MatDialog,
    private userService: UserService,
  ) {}

  public ngOnInit(): void {
    
    this.dataSource = new ReadingDataSource();
    this.readingListService.getReadings();

    this.userService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.user = { name: user.name ?? "", userName: user.userName ?? ""})
    ;

    this.readingListService.loadComplete$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dataSource.loadData(data)
        this.loading$.next(false);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.readingListService.destroy$.next();
  }

  public addNewReading(): void {

    const dialogRef = this.dialog.open(NewReadingDialog, {
      width: "500px",
      data: { 
        dayReading: {
          readingdate: moment()
        },
        nightReading: {},
        lastDayReading: this.readingListService.getLastDayReading(this.dataSource.data),
        lastNightReading: this.readingListService.getLastNightReading(this.dataSource.data),
        userName: this.user?.userName
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
        rate: "Day",
        userName: result.userName
      };

      const nightReading: Reading = {
        _id: UUID.UUID(),
        reading: Number(result.nightReading.reading),
        readingdate: result.dayReading.readingdate.startOf('day'),
        note: result.dayReading.note,
        rate: "Night",
        userName: result.userName
      };

      if(dayReading.reading > 0 && nightReading.reading > 0) { // TODO: Validation
        this.readingListService.addReading(dayReading, nightReading);          
      }
    });
  }

  public deleteReading(id: string) {

    const dialogRef = this.dialog.open(DeleteReadingComponent, {
      width: "300px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.readingListService.deleteReading(id);        
      }
    });
  }

  public editReading(reading: Reading): void {

    const dialogRef = this.dialog.open(EditReadingComponent, {
      width: "500px",
      data: {
        reading: reading.reading,
        readingdate: reading.readingdate,
        rate: reading.rate,
        _id: reading._id,
        note: reading.note ?? "",
        userName: reading.userName ?? "",
      } as Reading
    });

    dialogRef.afterClosed().subscribe((reading: Reading) => {
      
      if(!reading) {
        return;
      }

      if(reading.reading > 0) { // TODO: Validation
        this.readingListService.editReading({
          reading: Number(reading.reading),
          readingdate: reading.readingdate,
          rate: reading.rate,
          _id: reading._id,
          note: reading.note,
          userName: reading.userName
        });
      }
    });

  }

  public onSortChange(event: any): void {
    this.readingListService.sortEvent$.next({ direction: event.direction });
  }

  public onChangePage(pe: PageEvent): void {
    this.readingListService.pageEvent$.next(pe);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.readingListService.filterEvent$.next({ filterText: filterValue });
  }

  public toggleChart(): void {
    this.chartVisible = !this.chartVisible;
  }  

  public toggleForecast(): void {

    if(!this.dataSource.data || !this.dataSource.data.length) {
      return;
    }

    this.forecastService.calculateForecast([...this.dataSource.data], this.forecastApplied, this.user);
  }
}
