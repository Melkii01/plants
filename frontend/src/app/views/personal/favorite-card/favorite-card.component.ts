import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FavoriteComponent} from "../favorite/favorite.component";
import {CartType} from "../../../../types/cart.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {CartService} from "../../../shared/services/cart.service";

@Component({
  selector: 'favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.scss']
})
export class FavoriteCardComponent implements OnInit {

  @Input() product!: FavoriteType;
  @Output() remove: EventEmitter<string> = new EventEmitter<string>();
  serverStaticPath: string = environment.serverStaticPath;
  count: number = 1;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
  }

  // Добавление в корзину
  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.product.cartQuantity = this.count;
      })
  }

  // Выбираем сколько товаров нужно
  updateCount(value: number) {
    this.count = value;

    if (this.product.cartQuantity) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.cartQuantity = this.count;
        });
    }
  }

  // Удаление из корзины
  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = 1;
        this.product.cartQuantity = 0;
      });
  }

  // Удаление из списка избранных
  removeFromFavorites(productId: string) {
    this.remove.emit(productId);
  }

}
