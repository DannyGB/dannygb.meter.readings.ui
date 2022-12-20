import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReadingsService } from '../readings.service';
import { addReading, removeReading } from '../../state/app.actions';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Reading } from '../../state/reading.model';
import { MatDialog } from '@angular/material/dialog';
import { NewReadingData, NewReadingDialog } from '../new-reading/new-reading.component';
import { UUID } from 'angular2-uuid';
import { DeleteReadingComponent } from '../delete-reading/delete-reading.component';
import { ReadingDataSource } from '../reading.datasource';
import { BehaviorSubject, Subject, takeUntil, zipWith } from 'rxjs';
import * as moment from 'moment';
import { selectUser } from 'src/app/state/app.selectors';
import { User } from 'src/app/state/user.model';

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
  public columnsToDisplay = ['rate', 'reading', 'readingdate', 'userName', 'note', 'delete'];
  public pageSizeOptions = [5, 10, 20, 50];
  public dataSource!: ReadingDataSource;
  public chartVisible = true;
  public user?: User;
  private destroy$: Subject<void> = new Subject<void>();
  public forecastApplied: boolean = false;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private readingsService: ReadingsService,
    private store: Store,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.dataSource = new ReadingDataSource(this.readingsService, this.store);
    this.dataSource.loadData();
    this.store.select(selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.user = user)
    ;

    this.dataSource.loadComplete$.subscribe(() => {
      this.loading$.next(false);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
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
    this.dataSource.sortEvent$.next({ direction: event.direction });
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

  public toggleForecast(): void {

    if(!this.dataSource.data || !this.dataSource.data.length) {
      return;
    }

    const data = [...this.dataSource.data];

    if(this.forecastApplied) {

      // find last years usage for next month (or nearest) and add that to the list

      const nightData = [...data].filter(reading => {
        return reading.rate === "Night";
      }).sort((a,b) => {
        return a < b ? 1 : -1;
      });
      const dayData = [...data].filter(reading => {
        return reading.rate === "Day";
      }).sort((a,b) => {
        return a < b ? 1 : -1;
      });

      const lastRealNightReading = nightData[0];
      const lastRealDayReading = dayData[0];

      let lastMonthNight = nightData.findIndex(reading => {
        const d = moment(moment().add(-1, "y")).add(1, "M");
        return reading.readingdate.month() === d.month() && reading.readingdate.year() === d.year();
      });

      let lastMonthDay = dayData.findIndex(reading => {
        const d = moment(moment().add(-1, "y")).add(1, "M");
        return reading.readingdate.month() === d.month() && reading.readingdate.year() === d.year();
      });

      if(!lastMonthNight || !lastMonthDay 
          || lastMonthNight > (nightData.length-1)
          || lastMonthDay > (dayData.length-1)) {
        return;
      }

      const dayDiff = dayData[lastMonthDay].readingdate.diff(dayData[lastMonthDay+1].readingdate, "days");

      this.store.dispatch(addReading({ reading: {
        _id: UUID.UUID(),
        reading: lastRealDayReading.reading + (dayData[lastMonthDay].reading - dayData[lastMonthDay+1].reading),
        readingdate: moment(lastRealDayReading.readingdate).add(dayDiff, "days"),
        note: "forecast",
        rate: "Day",
        userName: this.user?.userName || ""
      } }));
      this.store.dispatch(addReading({ reading: {
        _id: UUID.UUID(),
        reading: lastRealNightReading.reading + (nightData[lastMonthNight].reading - nightData[lastMonthNight+1].reading),
        readingdate: moment(lastRealNightReading.readingdate).add(dayDiff, "days"),
        note: "forecast",
        rate: "Night",
        userName: this.user?.userName || ""
      } }));    
    } else {
      const ids = data.filter(reading => {
        return reading.note === "forecast";
      }).flatMap(reading => reading._id)
      .forEach(id => {
        this.store.dispatch(removeReading({readingId: id}))
      });
    }  
  }
}
