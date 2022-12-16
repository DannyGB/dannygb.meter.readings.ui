import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { selectOilReadings } from '../../state/app.selectors';
import { OilReading } from 'src/app/state/oil-reading.model';

@Component({
  selector: 'app-oil-reading-chart',
  templateUrl: './oil-reading-chart.component.html',
  styleUrls: ['./oil-reading-chart.component.css']
})
export class OilReadingChartComponent implements OnInit {
  
  @Input() public charts: Array<string> = ["line", "pie", "number-panel"];

  private colour = '#FFA726';

  public maxCost: string = "0";
  public minCost: string = "0";
  public avgCost: string = "0";
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
        this.generateCostData(readings);
        
      });
  }

  private generateCostData(readings: OilReading[]): void {

    if(!readings || !readings.length) {
      return;
    }

    const costs = readings.flatMap(r => {
      return {
        cost: r.cost,
        volume: r.volume
      }
    });

    this.maxCost = readings
      .flatMap(r => r.cost / r.volume)
      .reduce((p, c) => p > c ? p : c).toFixed(2);

    this.minCost = readings
      .flatMap(r => r.cost / r.volume)
      .reduce((p, c) => p > c ? c : p).toFixed(2);
    
    const accumulated = costs
      .reduce((p, c) => {
        return { 
          cost: p.cost + c.cost,
          volume: p.volume + c.volume
        }
    });
    
    this.avgCost = (accumulated.cost / accumulated.volume).toFixed(2);
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

  public isVisible(chartName: string): boolean {
    return this.charts.filter(name => name === chartName).length > 0;
  }
}
