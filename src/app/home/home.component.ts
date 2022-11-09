import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { HomeService } from './home.service';
import { Totals } from './totals.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public totals: Totals | undefined;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getTotals(moment().year())
      .subscribe(totals => this.totals = totals)
  }
}
