import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { OilReadingDataSource } from '../oil-reading.datasource';
import { UserService } from '../../login/user.service';
import * as moment from 'moment';
import { OilReading } from '../models/oil-reading.model';
import { UUID } from 'angular2-uuid';
import { PageEvent } from '@angular/material/paginator';
import { NewOilReadingData, NewOilReadingDialog } from '../new-oil-reading/new-oil-reading.component';
import { DeleteOilReadingComponent } from '../delete-oil-reading/delete-oil-reading.component';
import { User } from 'src/app/login/models/user.model';
import { OilReadingsListService } from './oil-readings-list.service';
import { EditOilReadingComponent } from '../edit-oil-reading/edit-oil-reading.component';

@Component({
  selector: 'app-oil-readings-list',
  templateUrl: './oil-readings-list.component.html',
  styleUrls: ['./oil-readings-list.component.css']
})
export class OilReadingsListComponent implements OnInit, OnDestroy {

  private initialPageSize = 50;
  public pageSize = this.initialPageSize;
  public columnsToDisplay = ['volume', 'cost', 'date', 'userName', 'note', 'edit', 'delete'];
  public pageSizeOptions = [5, 10, 20, 50];
  public dataSource!: OilReadingDataSource;
  public chartVisible = true;
  public user?: User;
  private destroy$: Subject<void> = new Subject<void>();
  public forecastApplied: boolean = false;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    public oilReadingsListService: OilReadingsListService) { }

    public ngOnInit(): void {

      this.dataSource = new OilReadingDataSource();
      this.oilReadingsListService.getReadings();

      this.userService.getUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe((user: User) => this.user = { name: user.name ?? "", userName: user.userName ?? "" });

      this.oilReadingsListService.loadComplete$
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.dataSource.loadData(data);
          this.loading$.next(false);
        });
    }
  
    public ngOnDestroy(): void {
      this.destroy$.next();
      this.oilReadingsListService.destroy$.next();
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
          this.oilReadingsListService.addReading(reading);
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
          this.oilReadingsListService.deleteReading(id)
        }
      });
    }

    public editReading(reading: OilReading): void {

      const dialogRef = this.dialog.open(EditOilReadingComponent, {
        width: "500px",
        data: {
          volume: reading.volume,
          date: reading.date,
          cost: reading.cost,
          _id: reading._id,
          note: reading.note ?? "",
          userName: reading.userName ?? "",
        } as OilReading
      });
  
      dialogRef.afterClosed().subscribe((reading: OilReading) => {
        
        if(!reading) {
          return;
        }
  
        if(reading.volume > 0 && reading.cost > 0) { // TODO: Validation
          this.oilReadingsListService.editReading({
            volume: Number(reading.volume),
            date: reading.date,
            cost: Number(reading.cost),
            _id: reading._id,
            note: reading.note,
            userName: reading.userName
          });
        }
      });
  
    }
  
    public onSortChange(event: any): void {
      this.oilReadingsListService.sortEvent$.next({ direction: event.direction });
    }
  
    public onChangePage(pe: PageEvent): void {
      this.oilReadingsListService.pageEvent$.next(pe);
    }
  
    public applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.oilReadingsListService.filterEvent$.next({ filterText: filterValue });
    }
  
    public toggleChart(): void {
      this.chartVisible = !this.chartVisible;
    }  
  
    public toggleForecast(): void {
    }
}
