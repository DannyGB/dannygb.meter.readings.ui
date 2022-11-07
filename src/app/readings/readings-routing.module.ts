import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserauthGuard } from '../userauth.guard';
import { ReadingListComponent } from './reading-list/reading-list.component';

const routes: Routes = [{
    path: 'readings',
    title: 'Readings', component: ReadingListComponent,
    canActivate: [UserauthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingsRoutingModule { }
