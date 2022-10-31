import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config, ConfigService } from '../config.service';
import { Reading } from './readings.model';

@Injectable({ providedIn: 'root' })
export class ReadingsService {

  private config: Config | undefined;
  private baseRoute: string = "reading";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.config = configService.config;
  }

  public getReadings(skip: number, pageLength: number, sortDirection: string): Observable<Array<Reading>> {

    return this.http
      .get<Reading[]>(
        `${this.getUrl()}/?skip=${skip}&take=${pageLength}&sort=${sortDirection}`
      )
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

  public getReadingCount(): Observable<number> {
    return this.http
      .get<number>(
        `${this.getUrl()}/count`
      )
      .pipe(map((count) => count || 0));
  }

  public addReading(reading: Reading): Observable<object> {
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

  private getUrl(): string {
    return `${this.config?.apiUrl}/${this.baseRoute}`;
  }
}