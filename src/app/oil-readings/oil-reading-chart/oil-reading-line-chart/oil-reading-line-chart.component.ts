import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-oil-reading-line-chart',
  templateUrl: './oil-reading-line-chart.component.html',
  styleUrls: ['./oil-reading-line-chart.component.css']
})
export class OilReadingLineChartComponent implements OnInit {

  @Input() data: any;
  @Input() options: any;
  @Input("loading") public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loading$.subscribe(val => this.loading = val);
  }

}
