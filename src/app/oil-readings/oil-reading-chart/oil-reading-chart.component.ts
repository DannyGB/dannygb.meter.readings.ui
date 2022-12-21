import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { selectOilReadings } from '../../state/app.selectors';
import { OilReading } from '../models/oil-reading.model';
import { BehaviorSubject, combineLatestWith, mergeWith, Subject, takeUntil, zip, zipWith } from 'rxjs';
import { OilCostGeneratorService } from '../oil-cost-generator.service';

@Component({
  selector: 'app-oil-reading-chart',
  templateUrl: './oil-reading-chart.component.html',
  styleUrls: ['./oil-reading-chart.component.css']
})
export class OilReadingChartComponent implements OnInit, OnDestroy {
  
  @Input() public charts: Array<string> = ["line", "pie", "number-panel"];
  @Input("loading") public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  
  private colour = '#FFA726';
  public loading: boolean = true;
  public maxCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public minCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avgCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avgDayUsage$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avg30DayCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public avgDayCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  public lineChartData: Subject<any> = new Subject<any>();
  private destroy$: Subject<void> = new Subject<void>();
  
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

  constructor(
    private store: Store,
    private oilCostGeneratorService: OilCostGeneratorService ) { }

  public ngOnInit(): void {
    this.store.select(selectOilReadings)
      .subscribe((readings: OilReading[]) => {
        
        if(!readings.length) {
          return;
        }

        const localReadingsData = [...readings]
          .sort((a, b) => a.date < b.date ? -1: 1);

        this.oilCostGeneratorService.generateLineChartData(localReadingsData, this.colour)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => this.lineChartData.next(data));

        this.oilCostGeneratorService.generateOilCostData(localReadingsData);
        this.oilCostGeneratorService.generateAveragePerDayData(localReadingsData);
        
      });

      this.subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public isVisible(chartName: string): boolean {
    return this.charts.filter(name => name === chartName).length > 0;
  }

  private subscribe(): void {
    this.loading$.subscribe(val => this.loading = val);

      this.oilCostGeneratorService.avg30DayCost$
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => this.avg30DayCost$.next(val));
      
      this.oilCostGeneratorService.avgCost$
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => this.avgCost$.next(val));

      this.oilCostGeneratorService.avgDayCost$
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => this.avgDayCost$.next(val));

      this.oilCostGeneratorService.avgDayUsage$
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => this.avgDayUsage$.next(val));

      this.oilCostGeneratorService.maxCost$
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => this.maxCost$.next(val));

      this.oilCostGeneratorService.minCost$
        .pipe(takeUntil(this.destroy$))
        .subscribe(val => this.minCost$.next(val));
  }
}
