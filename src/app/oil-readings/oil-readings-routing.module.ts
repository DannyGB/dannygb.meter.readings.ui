import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserauthGuard } from '../userauth.guard';
import { OilReadingsListComponent } from './oil-readings-list/oil-readings-list.component';

const routes: Routes = [{
    path: '',
    title: 'Oil Readings', 
    component: OilReadingsListComponent,
    canActivate: [UserauthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OilReadingsRoutingModule { }
