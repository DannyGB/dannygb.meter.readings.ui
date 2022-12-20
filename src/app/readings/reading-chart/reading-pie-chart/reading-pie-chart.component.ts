import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-reading-pie-chart',
  templateUrl: './reading-pie-chart.component.html',
  styleUrls: ['./reading-pie-chart.component.css']
})
export class ReadingPieChartComponent implements OnInit {

  @Input() data: any;
  @Input() options: any;
  @Input("loading") public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loading$.subscribe(val => this.loading = val);
  }

}
