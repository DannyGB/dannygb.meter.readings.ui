import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config, ConfigService } from '../config.service';
import { Reading } from './readings.model';

export interface GetParameters {
  skip: number;
  take: number;
  sortDirection: string;
  filterText: string;
}

@Injectable({ providedIn: 'root' })
export class ReadingsService {

  private config: Config | undefined;
  private baseRoute: string = "reading";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.config = configService.config;
  }

  public getReadings(parameters: GetParameters): Observable<Array<Reading>> {

    return this.http
      .get<Reading[]>(
        `${this.getUrl()}/?skip=${parameters.skip}&take=${parameters.take}&sort=${parameters.sortDirection}&filter=${parameters.filterText}`
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

  public getReadingCount(filterText: string): Observable<number> {
    return this.http
      .get<number>(
        `${this.getUrl()}/count?filter=${filterText}`
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