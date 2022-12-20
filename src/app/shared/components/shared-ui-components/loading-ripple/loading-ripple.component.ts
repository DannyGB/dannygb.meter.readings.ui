import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loading-ripple',
  templateUrl: './loading-ripple.component.html',
  styleUrls: ['./loading-ripple.component.css']
})
export class LoadingRippleComponent implements OnInit {

  @Input("loading") public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public loading: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.loading$.subscribe(val => this.loading = val);
  }

}
