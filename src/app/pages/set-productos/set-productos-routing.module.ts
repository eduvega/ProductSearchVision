import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetProductosPage } from './set-productos.page';

const routes: Routes = [
  {
    path: '',
    component: SetProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetProductosPageRoutingModule {}
