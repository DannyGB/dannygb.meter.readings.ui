import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Reading } from '../../state/reading.model';
import { selectReadings } from '../../state/app.selectors';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-reading-chart',
  templateUrl: './reading-chart.component.html',
  styleUrls: ['./reading-chart.component3.css']

})
export class ReadingChartComponent implements OnInit {
  
  @Input() public charts: Array<string> = ["line", "pie", "number-panel"];
  @Input("loading") public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loading: boolean = true;
  private dayColour = '#FFA726';
  private nightColour = '#FF1626';
  private day = "day";
  private night = "night"

  public averageDailyUsageDay: number = 0;
  public averageDailyUsageNight: number = 0;
  public data: any;
  public options: any = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: '#ebedef'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#ebedef'
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
            }
        },
        y: {
            ticks: {
                color: '#ebedef'
            },
            grid: {
                color: 'rgba(255,255,255,0.2)'
            }
        }
    }
  };

  public donutData: any;
  public donutOptions: any = {
    plugins: {
        legend: {
            labels: {
                color: '#ebedef'
            }
        }
    }
  };

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.select(selectReadings)
      .subscribe((readings: Reading[]) => {   
        
        if(!readings.length) {
          return;
        }

        var days = this.separateData(readings, this.day);
        var nights = this.separateData(readings, this.night);

        this.generateLineChartData(days, nights);
        this.generatePieChartData(days, nights);
        this.generateAverageDailyUsage(days, nights);
        
      });

      this.loading$.subscribe(val => this.loading = val);
  }

  private separateData(readings: Reading[], rate: string): Reading[] {
    return [...readings]
      .filter(e => e.rate.toLocaleLowerCase() == rate)
      .sort(this.sortByReading)
      .flatMap(this.calculatePerDayUnits);
  }

  private generateLineChartData(days: Reading[], nights: Reading[]): void {
    this.data = {
      labels: days.length 
        ? this.generateLabels(days, this.day)
        : this.generateLabels(nights, this.night),
      datasets: [
      {
          label: 'Day readings',
          data: days.length ? days.filter(e => e.rate.toLocaleLowerCase() == this.day).flatMap(reading => reading.reading) : [],
          borderColor: this.dayColour
      }, {
        label: 'Night readings',
        data: nights.length ? nights.filter(e => e.rate.toLocaleLowerCase() == this.night).flatMap(reading => reading.reading) : [],
        borderColor: this.nightColour
      }]
    }
  }

  private generateLabels(readings: Reading[], rate: string): string[] {
    return readings
      .filter(e => e.rate.toLocaleLowerCase() == rate)
      .flatMap(reading => (reading.readingdate as moment.Moment).format("DD MMMM YYYY"))
  }

  private generatePieChartData(days: Reading[], nights: Reading[]): void {
    this.donutData = {
      labels: ['Day', 'Night'],
      datasets: [
        {
          data: [
            days.length ? days.flatMap(reading => reading.reading).reduce((a, b) => a + b) : [],
            nights.length ? nights.flatMap(reading => reading.reading).reduce((a, b) => a + b) : []
          ],
          backgroundColor: [
              this.dayColour,
              this.nightColour
          ],
          hoverBackgroundColor: [
            this.dayColour,
            this.nightColour
          ]
      }
      ]
    }
  }

  private generateAverageDailyUsage(dayReadings: Reading[], nightReadings: Reading[]): void {
    this.averageDailyUsageDay = Math.ceil((dayReadings && dayReadings.length) 
      ? dayReadings
        .flatMap(reading => reading.reading)
        .reduce((prev, curr) => prev + curr) / dayReadings.length 
      : 0);

    this.averageDailyUsageNight = Math.ceil((nightReadings && nightReadings.length)
      ? nightReadings
        .flatMap(reading => reading.reading)
        .reduce((prev, curr) => prev + curr) / nightReadings.length
      : 0);
  }

  private calculatePerDayUnits(reading: Reading, idx: number, arr: Reading[]): Reading {
    const days = idx > 0 ? (reading.readingdate as moment.Moment).diff(arr[idx-1].readingdate, 'd') : 1;
          return { 
            reading: idx > 0 ? Math.ceil((reading.reading - arr[idx-1].reading) / days) : 0,
            rate: reading.rate,
            note: reading.note,
            readingdate: reading.readingdate
          } as Reading;
  }

  private sortByReading(a: Reading, b: Reading): number {
    return a.reading > b.reading ? 1 : -1;
  }

  public isVisible(chartName: string): boolean {
    return this.charts.filter(name => name === chartName).length > 0;
  }
}
