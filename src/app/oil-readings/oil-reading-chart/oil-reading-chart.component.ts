import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Reading } from '../../state/reading.model';
import { selectOilReadings, selectReadings } from '../../state/app.selectors';
import { OilReading } from 'src/app/state/oil-reading.model';

@Component({
  selector: 'app-oil-reading-chart',
  templateUrl: './oil-reading-chart.component.html',
  styleUrls: ['./oil-reading-chart.component.css']
})
export class OilReadingChartComponent implements OnInit {
  
  @Input() public charts: Array<string> = ["line", "pie", "number-panel"];

  private colour = '#FFA726';

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
    this.store.select(selectOilReadings)
      .subscribe((readings: OilReading[]) => {   
        
        if(!readings.length) {
          return;
        }

        this.generateLineChartData(readings);
        //this.generatePieChartData(days, nights);
        //this.generateAverageDailyUsage(days, nights);
        
      });
  }

  private generateLineChartData(readings: OilReading[]): void {
    this.data = {
      labels:  this.generateLabels(readings),
      datasets: [
      {
          label: 'Cost',
          data: readings.length ? readings.flatMap(reading => reading.cost) : [],
          borderColor: this.colour
      }]
    }
  }

  private generateLabels(readings: OilReading[]): string[] {
    return readings
      .flatMap(reading => (reading.date as moment.Moment).format("DD MMMM YYYY"))
  }

  // private generatePieChartData(days: Reading[], nights: Reading[]): void {
  //   this.donutData = {
  //     labels: ['Day', 'Night'],
  //     datasets: [
  //       {
  //         data: [
  //           days.length ? days.flatMap(reading => reading.reading).reduce((a, b) => a + b) : [],
  //           nights.length ? nights.flatMap(reading => reading.reading).reduce((a, b) => a + b) : []
  //         ],
  //         backgroundColor: [
  //             this.dayColour,
  //             this.nightColour
  //         ],
  //         hoverBackgroundColor: [
  //           this.dayColour,
  //           this.nightColour
  //         ]
  //     }
  //     ]
  //   }
  // }

  // private generateAverageDailyUsage(dayReadings: Reading[], nightReadings: Reading[]): void {
  //   this.averageDailyUsageDay = Math.ceil((dayReadings && dayReadings.length) 
  //     ? dayReadings
  //       .flatMap(reading => reading.reading)
  //       .reduce((prev, curr) => prev + curr) / dayReadings.length 
  //     : 0);

  //   this.averageDailyUsageNight = Math.ceil((nightReadings && nightReadings.length)
  //     ? nightReadings
  //       .flatMap(reading => reading.reading)
  //       .reduce((prev, curr) => prev + curr) / nightReadings.length
  //     : 0);
  // }

  // private calculatePerDayUnits(reading: Reading, idx: number, arr: Reading[]): Reading {
  //   const days = idx > 0 ? (reading.readingdate as moment.Moment).diff(arr[idx-1].readingdate, 'd') : 1;
  //         return { 
  //           reading: idx > 0 ? Math.ceil((reading.reading - arr[idx-1].reading) / days) : 0,
  //           rate: reading.rate,
  //           note: reading.note,
  //           readingdate: reading.readingdate
  //         } as Reading;
  // }

  // private sortByReading(a: Reading, b: Reading): number {
  //   return a.reading > b.reading ? 1 : -1;
  // }

  public isVisible(chartName: string): boolean {
    return this.charts.filter(name => name === chartName).length > 0;
  }
}
