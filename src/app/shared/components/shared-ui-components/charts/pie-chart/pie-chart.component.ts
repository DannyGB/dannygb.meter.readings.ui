import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  @Input() data: any;
  @Input() options: any;
  @Input("loading") public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loading$.subscribe(val => this.loading = val);
  }
}
