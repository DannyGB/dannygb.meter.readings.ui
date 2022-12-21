import { addOilReading, removeOilReading } from 'src/app/state/app.actions';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { OilReading } from '../models/oil-reading.model';
import { OilReadingsService } from '../oil-readings.service';

@Injectable({
  providedIn: 'root'
})
export class OilReadingsListService {

  public destroy$: Subject<void> = new Subject<void>();

  constructor(private readingsService: OilReadingsService,
    private store: Store) { }

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
}
