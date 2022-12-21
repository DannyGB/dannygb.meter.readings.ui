import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatestWith, Observable, of, Subject } from 'rxjs';
import { OilReading } from './models/oil-reading.model';

@Injectable({
  providedIn: 'root'
})
export class OilCostGeneratorService {

  public maxCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public minCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avgCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avgDayUsage$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avg30DayCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avgDayCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");

  constructor() { }

  public generateOilCostData(
    readings: OilReading[]): void {

    if(!readings || !readings.length) {
      return;
    }

    const costs = readings.flatMap(r => {
      return {
        cost: r.cost,
        volume: r.volume
      }
    });

    this.maxCost$.next(readings
      .flatMap(r => r.cost / r.volume)
      .reduce((p, c) => p > c ? p : c).toFixed(2));

      this.minCost$.next(readings
      .flatMap(r => r.cost / r.volume)
      .reduce((p, c) => p > c ? c : p).toFixed(2));
    
    const accumulated = costs
      .reduce((p, c) => {
        return { 
          cost: p.cost + c.cost,
          volume: p.volume + c.volume
        }
    });
    
    this.avgCost$.next((accumulated.cost / accumulated.volume).toFixed(2));

    this.avgDayUsage$
      .pipe(combineLatestWith(this.avgCost$))
      .subscribe(zip => {
        const avgDayCost = (+zip[1] * +zip[0]).toFixed(2);
        this.avgDayCost$.next(avgDayCost);
        this.avg30DayCost$.next((+avgDayCost * 30).toFixed(2));
      });
  }

  public generateAveragePerDayData(readings: OilReading[]): void {
    const totalCost = readings
      .flatMap(r => r.cost)
      .reduce((p, c) => p + c);


    const maxDate = readings
      .flatMap(r => r.date)
      .reduce((p, c) => p < c ? c : p);

    const minDate = readings
    .flatMap(r => r.date)
    .reduce((p, c) => p > c ? c : p);

    const dateDiff = maxDate.diff(minDate, "days");

    if(totalCost <= 0 || dateDiff <= 0) {
      return;
    }

    this.avgDayUsage$.next((totalCost / dateDiff).toFixed(2));

  }

  public generateLineChartData(readings: OilReading[], colour: string): Observable<any> {

    return of({
      labels:  this.generateLabels(readings),
      datasets: [
      {
          label: 'Cost',
          data: readings.length ? readings.flatMap(reading => reading.cost) : [],
          borderColor: colour
      }]
    });
  } 

  private generateLabels(readings: OilReading[]): string[] {
    return readings
      .flatMap(reading => (reading.date as moment.Moment).format("DD MMMM YYYY"))
  }
}
