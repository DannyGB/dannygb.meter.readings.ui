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

  constructor(
    private readingsService: ReadingsService,
    private store: Store,
  ) { }

  public deleteReading(id: string): Observable<object> {
    return this.readingsService.deleteReading(id)
  }

  public dispatchRemoveReading(id: string){
    this.store.dispatch(removeReading({readingId: id}))
  }

  public addReading(dayReading: Reading, nightReading: Reading): Observable<any[]> {
    return this.readingsService
      .addReading(dayReading)
      .pipe(zipWith(this.readingsService.addReading(nightReading)));
  }

  public dispatchAddReading(dayReading: Reading, nightReading: Reading): void {
    this.store.dispatch(addReading({ reading: dayReading }));
    this.store.dispatch(addReading({ reading: nightReading }));
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
