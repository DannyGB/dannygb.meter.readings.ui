import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'readings', pathMatch: 'full', loadChildren: () => import('./readings/readings.module').then(m => m.ReadingsModule) },
    { path: 'oil', pathMatch: 'full', loadChildren: () => import('./oil-readings/oil-readings.module').then(m => m.OilReadingsModule) },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
