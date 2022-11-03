import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Reading } from '../readings.model';
import { selectReadings } from '../state/readings.selectors';

@Component({
  selector: 'app-reading-chart',
  templateUrl: './reading-chart.component.html',
  styleUrls: ['./reading-chart.component.css']
})
export class ReadingChartComponent implements OnInit {
  
  public data: any;
  public options: any;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.select(selectReadings)
      .subscribe((readings: Reading[]) => {   
        
        var days = [...readings].filter(e => e.rate.toLocaleLowerCase() == "day")
          .sort(this.sort)
          .flatMap(this.reduce);

        var nights = [...readings].filter(e => e.rate.toLocaleLowerCase() == "night")
          .sort(this.sort)
          .flatMap(this.reduce);

        this.data = {
          labels: days.filter(e => e.rate.toLocaleLowerCase() == "day").flatMap(reading => {
            return (reading.readingdate as moment.Moment).format("DD MMMM YYYY");
          }),
          datasets: [
          {
              label: 'Day readings',
              data: days.filter(e => e.rate.toLocaleLowerCase() == "day").flatMap(reading => {
                return reading.reading;
              }),
              borderColor: '#FFA726'
          }, {
            label: 'Night readings',
            data: nights.filter(e => e.rate.toLocaleLowerCase() == "night").flatMap(reading => {
              return reading.reading;
            }),
            borderColor: '#FF1626'
          }]
        }
      });


      this.options = {
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


  }

  private reduce(reading: Reading, idx: number, arr: Reading[]): Reading {
    const days = idx > 0 ? (reading.readingdate as moment.Moment).diff(arr[idx-1].readingdate, 'd') : 1;
          return { 
            reading: idx > 0 ? Math.ceil((reading.reading - arr[idx-1].reading) / days) : 0,
            rate: reading.rate,
            note: reading.note,
            readingdate: reading.readingdate
          } as Reading;
  }

  private sort(a: Reading, b: Reading): number {
    return a.reading > b.reading ? 1 : -1;
  }
}
