import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { OilReadingDataSource } from '../oil-reading.datasource';
import { OilReadingsService } from '../oil-readings.service';
import { selectUser } from 'src/app/state/app.selectors';
import * as moment from 'moment';
import { OilReading } from '../models/oil-reading.model';
import { UUID } from 'angular2-uuid';
import { addOilReading, removeOilReading } from 'src/app/state/app.actions';
import { PageEvent } from '@angular/material/paginator';
import { NewOilReadingData, NewOilReadingDialog } from '../new-oil-reading/new-oil-reading.component';
import { DeleteOilReadingComponent } from '../delete-oil-reading/delete-oil-reading.component';

@Component({
  selector: 'app-oil-readings-list',
  templateUrl: './oil-readings-list.component.html',
  styleUrls: ['./oil-readings-list.component.css']
})
export class OilReadingsListComponent implements OnInit, OnDestroy {

  private initialPageSize = 50;
  public pageSize = this.initialPageSize;
  public columnsToDisplay = ['volume', 'cost', 'date', 'userName', 'note', 'delete'];
  public pageSizeOptions = [5, 10, 20, 50];
  public dataSource!: OilReadingDataSource;
  public chartVisible = true;
  public user?: { name: string, userName: string };
  private destroy$: Subject<void> = new Subject<void>();
  public forecastApplied: boolean = false;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  
  constructor(
    private readingsService: OilReadingsService,
    private store: Store,
    private dialog: MatDialog) { }

    public ngOnInit(): void {
      this.dataSource = new OilReadingDataSource(this.readingsService, this.store);
      this.dataSource.loadData();
      this.store.select(selectUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe(user => this.user = { name: user.name ?? "", userName: user.userName ?? "" })
      ;

      this.dataSource.loadComplete$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loading$.next(false));
    }
  
    public ngOnDestroy(): void {
      this.destroy$.next();
    }
  
    public addNewReading(): void {
  
      const dialogRef = this.dialog.open(NewOilReadingDialog, {
        width: "500px",
        data: { 
          date: moment(),          
          userName: this.user?.userName,
          cost: 0,
        }
      });
  
      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: NewOilReadingData) => {
        if(!result) {
          return;
        }
  
        const reading: OilReading = {
          _id: UUID.UUID(),
          volume: Number(result.volume),
          date: result.date.startOf('day'),
          note: result.note,
          userName: result.userName,
          cost: Number(result.cost),
        };
  
        if(reading.volume > 0 ) { // TODO: Validation
          this.readingsService.addReading(reading)
            .pipe(takeUntil(this.destroy$))
            .subscribe((location: any) => {
              this.store.dispatch(addOilReading({ reading }));
          });
        }
      });
    }
  
    public deleteReading(id: string) {
  
      const dialogRef = this.dialog.open(DeleteOilReadingComponent, {
        width: "300px"
      });
  
      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
        if(result) {
          this.readingsService.deleteReading(id).subscribe((location: any) => {
            this.store.dispatch(removeOilReading({readingId: id}))
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
    }
}
