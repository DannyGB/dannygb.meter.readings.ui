import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-readings-number-panel',
  templateUrl: './readings-number-panel.component.html',
  styleUrls: ['./readings-number-panel.component.css']
})
export class ReadingsNumberPanelComponent implements OnInit {

  @Input() public number: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
