import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reading-pie-chart',
  templateUrl: './reading-pie-chart.component.html',
  styleUrls: ['./reading-pie-chart.component.css']
})
export class ReadingPieChartComponent implements OnInit {

  @Input() data: any;
  @Input() options: any;

  constructor() { }

  ngOnInit(): void {
  }

}
