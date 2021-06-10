import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetProductosPageRoutingModule } from './set-productos-routing.module';

import { SetProductosPage } from './set-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetProductosPageRoutingModule
  ],
  declarations: [SetProductosPage]
})
export class SetProductosPageModule {}
