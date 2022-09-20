import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reading } from './readings.model';

@Injectable({ providedIn: 'root' })
export class ReadingsService {
  constructor(private http: HttpClient) {}

  public getReadings(skip: number, pageLength: number): Observable<Array<Reading>> {
    return this.http
      .get<Reading[]>(
        `http://localhost:8000/reading/?skip=${skip}&take=${pageLength}`
      )
      .pipe(map((readings) => readings || []));
  }

  public getReadingCount(): Observable<number> {
    return this.http
      .get<number>(
        `http://localhost:8000/reading/count`
      )
      .pipe(map((count) => count || 0));
  }

  public addReading(reading: Reading): Observable<object> {
    return this.http
      .post(`http://localhost:8000/reading/${reading._id}`,
      reading
    )
    .pipe(map((location) => location || ""));
  }
}