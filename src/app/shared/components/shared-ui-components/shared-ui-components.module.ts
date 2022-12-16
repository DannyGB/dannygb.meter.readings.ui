import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPanelComponent } from './number-panel/number-panel.component';

@NgModule({
  declarations: [
    NumberPanelComponent
  ],
  exports: [
    NumberPanelComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedUiComponentsModule { }
