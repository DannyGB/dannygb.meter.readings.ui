import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetParameters } from '../readings/readings.service';
import { OilReading } from './models/oil-reading.model';

@Injectable({
  providedIn: 'root'
})
export class OilReadingsService {

  private baseRoute: string = "oil";

  constructor(private http: HttpClient) {}

  public getReadings(parameters: GetParameters): Observable<Array<OilReading>> {

    return this.http
      .get<OilReading[]>(
        `${this.getUrl()}/?skip=${parameters.skip}&take=${parameters.take}&sort=${parameters.sortDirection}&filter=${parameters.filterText}`
      )
      .pipe(map((readings) => {
        if (!readings) {
          return [];
        }

        return readings.map(reading => {
          reading.date = moment(reading.date);
          return reading;
        });
      }));
  }

  public getReadingCount(filterText: string): Observable<number> {
    return this.http
      .get<number>(
        `${this.getUrl()}/count?filter=${filterText}`
      )
      .pipe(map((count) => count || 0));
  }

  public addReading(reading: OilReading): Observable<object> {
    return this.http
      .post(
        `${this.getUrl()}/${reading._id}`, reading
      )
      .pipe(map((location) => location || ""));
  }

  public deleteReading(id: string): Observable<object> {
    return this.http
      .delete(
        `${this.getUrl()}/${id}`
        );
  }

  public editReading(reading: OilReading): Observable<object> {
    return this.http.put(`${this.getUrl()}/${reading._id}`, reading);
  }

  private getUrl(): string {
    return `${environment.oilApiUrl}/${this.baseRoute}`;
  }

  public sortByReadingDesc(a: OilReading, b: OilReading): number {
    return this.sortByReading(a, b, "desc");
  }

  public sortByReadingAsc(a: OilReading, b: OilReading): number {
    return this.sortByReading(a, b, "asc");
  }

  public sortByReading(a: OilReading, b: OilReading, direction: string): number {
    return direction === "asc"
      ? a.volume > b.volume ? 1 : -1
      : a.volume < b.volume ? 1 : -1
  } 

  public getLastReading(readings: OilReading[]): number {
    return readings.length 
      ? readings.sort(this.sortByReadingDesc.bind(this))[0].volume
      : 0;
  }
}
