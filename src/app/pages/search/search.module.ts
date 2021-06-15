import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { searchPage } from './search.page';

import { searchPageRoutingModule } from './search-routing.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: searchPage }]),
    searchPageRoutingModule,
  ],
  declarations: [searchPage]
})
export class searchPageModule {}
