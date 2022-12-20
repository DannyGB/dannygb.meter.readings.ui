import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberPanelComponent } from './number-panel/number-panel.component';
import { LoadingRippleComponent } from './loading-ripple/loading-ripple.component';

@NgModule({
  declarations: [
    NumberPanelComponent,
    LoadingRippleComponent
  ],
  exports: [
    NumberPanelComponent,
    LoadingRippleComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class SharedUiComponentsModule { }
