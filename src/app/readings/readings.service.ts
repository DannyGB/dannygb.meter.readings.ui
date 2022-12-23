import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Reading } from './models/reading.model';
import { Totals } from './models/totals.model';

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

  public getTotals(year: number): Observable<Totals> {

    return this.http
      .get<Totals>(
        `${this.getUrl()}/${year}/total`
      )
      .pipe(map((totals) => {
        if (!totals) {
          return { Day: 0, Night: 0 } as Totals;
        }

        return totals;
      }));
  }
  
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

  public editReading(reading: Reading): Observable<object> {
    return this.http.put(`${this.getUrl()}/${reading._id}`, reading);
  }

  public deleteReading(id: string): Observable<object> {
    return this.http.delete(`${this.getUrl()}/${id}`);
  }

  private getUrl(): string {
    return `${environment.apiUrl}/${this.baseRoute}`;
  }  
}