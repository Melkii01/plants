import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService:CartService) {
  }

  ngOnInit(): void {
    // Запрашиваем список избранных
    this.favoriteService.getFavorites()
      .subscribe((favorites: FavoriteType[] | DefaultResponseType) => {
        if ((favorites as DefaultResponseType).error !== undefined) {
          const error = (favorites as DefaultResponseType).message;
          throw new Error(error);
        }

        // Записываем список в массив
        this.products = favorites as FavoriteType[];

        // Запрашиваем корзину
        this.cartService.getCart()
          .subscribe((cartProducts: CartType | DefaultResponseType) => {
            if ((cartProducts as DefaultResponseType).error !== undefined) {
              throw new Error((cartProducts as DefaultResponseType).message);
            }

            // Записываем в переменную
            const cartDataResponse = cartProducts as CartType;

            // Если ответ есть, ищем товар, который находится в корзине
            if (cartDataResponse) {
              this.products  = this.products.map(favorite=>{
                const productInCart = cartDataResponse.items.find(item => item.product.id === favorite.id);

                if (productInCart) {
                  // Если продукт находится в корзине, добавляем в флаг и сколько штук
                  favorite.isInCart = true;
                  favorite.cartQuantity = productInCart.quantity;
                }else {
                  favorite.isInCart = false;
                }
                return favorite;
              })
            }
          });
      })
  }

  // Удаления из списка избранных
  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }

        // Удаляем элемент из массива
        this.products = this.products.filter(item => item.id !== id);
      })
  }
}
