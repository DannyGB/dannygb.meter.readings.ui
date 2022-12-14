import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-number-panel',
  templateUrl: './number-panel.component.html',
  styleUrls: ['./number-panel.component.css']
})
export class NumberPanelComponent implements OnInit {

  @Input() public number: string | number | null = "0";
  @Input("loading") public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public loading: boolean = true;

  constructor() { }

  public ngOnInit(): void {
    this.loading$.subscribe(val => this.loading = val);
  }
}