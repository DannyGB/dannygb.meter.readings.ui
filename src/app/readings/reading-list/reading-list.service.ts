import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { zipWith, takeUntil, Subject, Observable } from 'rxjs';
import { ReadingsService } from '../readings.service';
import { Reading } from '../models/reading.model';
import { addReading, removeReading } from '../../state/app.actions';

@Injectable({
  providedIn: 'root'
})
export class ReadingListService {

  public destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readingsService: ReadingsService,
    private store: Store,
  ) { }

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
}
