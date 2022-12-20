import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Reading } from '../state/reading.model';

export interface GetParameters {
  skip: number;
  take: number;
  sortDirection: string;
  filterText: string;
}

@Injectable({ providedIn: 'root' })
export class ReadingsService {

  private baseRoute: string = "reading";

  constructor(private http: HttpClient) {}

  public getReadings(parameters: GetParameters): Observable<Array<Reading>> {
    
    return this.http
      .get<Reading[]>(`${this.getUrl()}/?skip=${parameters.skip}&take=${parameters.take}&sort=${parameters.sortDirection}&filter=${parameters.filterText}`)
      .pipe(map((readings) => {
        
        if (!readings) {
          return [];
        }

        return readings.map(reading => {
          reading.readingdate = moment(reading.readingdate);
          return reading;
        });
      }));
  }

  public getReadingCount(filterText: string): Observable<number> {
    return this.http
      .get<number>(`${this.getUrl()}/count?filter=${filterText}`)
      .pipe(map((count) => count || 0));
  }

  public addReading(reading: Reading): Observable<object> {
    return this.http
      .post(`${this.getUrl()}/${reading._id}`, reading)
      .pipe(map((location) => location || ""));
  }

  public deleteReading(id: string): Observable<object> {
    return this.http.delete(`${this.getUrl()}/${id}`);
  }

  private getUrl(): string {
    return `${environment.apiUrl}/${this.baseRoute}`;
  }

  public sortByReadingDesc(a: Reading, b: Reading): number {
    return this.sortByReading(a, b, "desc");
  }

  public sortByReadingAsc(a: Reading, b: Reading): number {
    return this.sortByReading(a, b, "asc");
  }

  public sortByReading(a: Reading, b: Reading, direction: string): number {
    return direction === "asc"
      ? a.reading > b.reading ? 1 : -1
      : a.reading < b.reading ? 1 : -1
  } 

  public separateDataByRate(readings: Reading[], rate: string): Reading[] {
    return [...readings]
      .filter(e => e.rate.toLocaleLowerCase() == rate)      
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
}