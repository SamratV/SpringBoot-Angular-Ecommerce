import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CartItem } from '../common/cart-item';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartItems: CartItem[] = [];

    /*
        Subject is a subclass of Observable. We can use "Subject" to
        publish events in our code. The event will be sent to all of
        the subscribers.
    */
    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();

    constructor() { }

    addToCart(cartItem: CartItem) {
        // Check if the item is already in the cart.
        let alreadyExistsInCart: boolean = false;
        let existingCartItem: CartItem = undefined;

        if (this.cartItems.length > 0) {
            // Find the item based on the item id.
            existingCartItem = this.cartItems.find(item => item.id === cartItem.id);

            // Check if we found it.
            alreadyExistsInCart = (existingCartItem != undefined);
        }

        if (alreadyExistsInCart) {
            existingCartItem.quantity++;
        } else {
            this.cartItems.push(cartItem);
        }

        // Compute cart's total price and total quantity.
        this.computeCartTotals();
    }

    computeCartTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;

        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;
        }

        // Publish the new values for all the subscribers of the data.
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        // Log cart data for debugging purpose.
        // this.logCartData(totalPriceValue, totalQuantityValue);
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log(`Contents of the cart are as follows:`);

        for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

            console.log(`Name: ${tempCartItem.name}, Quantity: ${tempCartItem.quantity}, Unit Price: ${tempCartItem.unitPrice}, Sub-total Price: ${subTotalPrice}`);
        }

        // ".toFixed(2)" => upto 2 decimal places.
        console.log(`Total Cart Value: ${totalPriceValue.toFixed(2)}, Total Quantity: ${totalQuantityValue}`);

        console.log(`------------------------------`);
    }

    decrementQuantity(item: CartItem) {
        item.quantity -= 1;

        if (item.quantity == 0) {
            this.remove(item);
        } else {
            this.computeCartTotals();
        }
    }

    remove(item: CartItem) {
        const index = this.cartItems.findIndex(it => it.id == item.id);

        if(index > -1) {
            this.cartItems.splice(index, 1);
            this.computeCartTotals();
        }
    }
}
