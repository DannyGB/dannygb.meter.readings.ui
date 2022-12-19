import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-panel',
  templateUrl: './number-panel.component.html',
  styleUrls: ['./number-panel.component.css']
})
export class NumberPanelComponent {

  @Input() public number: string | number | null = "0";

  constructor() { }
}