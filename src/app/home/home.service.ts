import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Totals } from './totals.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseRoute: string = "reading";

  constructor(private http: HttpClient) { }

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

  private getUrl(): string {
    return `${environment.apiUrl}/${this.baseRoute}`;
  }
}
