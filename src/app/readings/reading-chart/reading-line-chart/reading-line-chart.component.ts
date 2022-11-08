import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reading-line-chart',
  templateUrl: './reading-line-chart.component.html'
})
export class ReadingLineChartComponent implements OnInit {

  @Input() data: any;
  @Input() options: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}