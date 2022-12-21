import { addOilReading, removeOilReading, retrievedOilReadingList } from 'src/app/state/app.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatestWith, takeUntil, zipWith } from 'rxjs';
import { OilReading } from '../models/oil-reading.model';
import { OilReadingsService } from '../oil-readings.service';
import { PageEvent } from '@angular/material/paginator';
import { ListService } from 'src/app/shared/list.service';

@Injectable({
  providedIn: 'root'
})
export class OilReadingsListService extends ListService<OilReading[]>{

  constructor(private readingsService: OilReadingsService,
    private store: Store) { 
      super();
    }

  public addReading(reading: OilReading): void {
    this.readingsService
      .addReading(reading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => this.store.dispatch(addOilReading({ reading })));
  }

  public deleteReading(id: string): void {
    this.readingsService
      .deleteReading(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => this.store.dispatch(removeOilReading({readingId: id})));
  }

  public getReadings(): void {
    this.pageEvent$.pipe(combineLatestWith(this.sortEvent$, this.filterEvent$))
    .subscribe((pe: any) => {
        this.readingsService.getReadings({ 
            skip: this.getSkip(pe[0]),
            take: pe[0].pageSize,
            sortDirection: pe[1].direction,
            filterText: pe[2].filterText
        }).pipe(zipWith(this.readingsService.getReadingCount(pe[2].filterText)))
        .subscribe({
            next: val => {
                this.totalReadings$.next(val[1]);
                this.store.dispatch(retrievedOilReadingList({ oilReadings: val[0] }))
                this.loadComplete$.next(val[0]);
            },
            error: err => { 
                this.totalReadings$.next(0);
                this.store.dispatch(retrievedOilReadingList({ oilReadings: [] }))
                this.loadComplete$.next([]);
            }
        });
    });
  }

  private getSkip(pe: PageEvent): number { return pe.pageIndex * pe.pageSize; }
}
