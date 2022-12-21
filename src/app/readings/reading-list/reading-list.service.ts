import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { zipWith, takeUntil, combineLatestWith } from 'rxjs';
import { ReadingsService } from '../readings.service';
import { Reading } from '../models/reading.model';
import { addReading, removeReading, retrievedReadingList } from '../../state/app.actions';
import { PageEvent } from '@angular/material/paginator';
import { ListService } from 'src/app/shared/list.service';

@Injectable({
  providedIn: 'root'
})
export class ReadingListService extends ListService<Reading[]> {

  constructor(
    private readingsService: ReadingsService,
    private store: Store,
  ) {
    super();
   }

  public deleteReading(id: string): void {
    this.readingsService
      .deleteReading(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => this.store.dispatch(removeReading({readingId: id})));
  }

  public addReading(dayReading: Reading, nightReading: Reading) {
    this.readingsService
      .addReading(dayReading)      
      .pipe(zipWith(this.readingsService.addReading(nightReading)))
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        this.store.dispatch(addReading({ reading: dayReading }));
        this.store.dispatch(addReading({ reading: nightReading }));
      })
  }

  public getLastDayReading(readings: Reading[]): number {
    return readings.length 
      ? this.separateDataByRate(readings, "day")
          .sort(this.sortByReadingDesc.bind(this))[0].reading : 0;
  }

  public getLastNightReading(readings: Reading[]): number {
    return readings.length 
      ? this.separateDataByRate(readings, "night")
          .sort(this.sortByReadingDesc.bind(this))[0].reading : 0;
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
                this.store.dispatch(retrievedReadingList({ readings: val[0] }))
                this.loadComplete$.next(val[0]);
            },
            error: err => { 
                this.totalReadings$.next(0);
                this.store.dispatch(retrievedReadingList({ readings: [] }))
                this.loadComplete$.next([]);
            }
        });
    });
  }

  private separateDataByRate(readings: Reading[], rate: string): Reading[] {
    return [...readings]
      .filter(e => e.rate.toLocaleLowerCase() == rate)      
  } 

  private sortByReadingDesc(a: Reading, b: Reading): number {
    return this.sortByReading(a, b, "desc");
  }

  private sortByReadingAsc(a: Reading, b: Reading): number {
    return this.sortByReading(a, b, "asc");
  }

  private sortByReading(a: Reading, b: Reading, direction: string): number {
    return direction === "asc"
      ? a.reading > b.reading ? 1 : -1
      : a.reading < b.reading ? 1 : -1
  } 

  private getSkip(pe: PageEvent): number { return pe.pageIndex * pe.pageSize; }
}
