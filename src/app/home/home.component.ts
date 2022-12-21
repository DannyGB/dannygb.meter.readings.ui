import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { OilCostGeneratorService } from '../oil-readings/oil-cost-generator.service';
import { OilReadingsService } from '../oil-readings/oil-readings.service';
import { ReadingsService } from '../readings/readings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public totals: any | undefined;
  public avg30DayCost$: BehaviorSubject<string> = new BehaviorSubject<string>("0");
  private destroy$: Subject<void> = new Subject<void>();
  
  constructor(
    private readingsService: ReadingsService,
    private oilCostGeneratorService: OilCostGeneratorService,
    private oilReadingsService: OilReadingsService) { }

  public ngOnInit(): void {
    this.readingsService.getTotals(moment().year())
      .pipe(takeUntil(this.destroy$))
      .subscribe(totals => this.totals = totals)

    const params = {
      skip: 0,
      take: 50,
      sortDirection: "asc",
      filterText: ""
    }
    
    this.oilReadingsService.getReadings(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(readings => {
        this.oilCostGeneratorService.generateAveragePerDayData(readings);
        this.oilCostGeneratorService.generateOilCostData(readings);
      });

    this.oilCostGeneratorService.avg30DayCost$
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => this.avg30DayCost$.next(val));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }
}
