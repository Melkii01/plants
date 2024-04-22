import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PersonalRoutingModule} from './personal-routing.module';
import {FavoriteComponent} from './favorite/favorite.component';
import {InfoComponent} from './info/info.component';
import {OrdersComponent} from './orders/orders.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import { FavoriteCardComponent } from './favorite-card/favorite-card.component';


@NgModule({
  declarations: [
    FavoriteComponent,
    InfoComponent,
    OrdersComponent,
    FavoriteCardComponent
  ],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PersonalModule {
}
