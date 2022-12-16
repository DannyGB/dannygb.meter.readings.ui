import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-oil-reading-line-chart',
  templateUrl: './oil-reading-line-chart.component.html',
  styleUrls: ['./oil-reading-line-chart.component.css']
})
export class OilReadingLineChartComponent implements OnInit {

  @Input() data: any;
  @Input() options: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
