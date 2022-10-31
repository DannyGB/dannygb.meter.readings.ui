import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReadingListComponent } from './reading-list/reading-list.component';

const routes: Routes = [
  {path: 'readings', title: 'Readings', component: ReadingListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingsRoutingModule { }
