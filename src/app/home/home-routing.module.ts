import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserauthGuard } from '../userauth.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [{
    path: 'home',
    title: 'Home', component: HomeComponent,
    canActivate: [UserauthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
