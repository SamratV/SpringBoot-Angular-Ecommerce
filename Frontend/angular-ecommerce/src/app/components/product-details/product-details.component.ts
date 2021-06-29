import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

    /*
        If we leave the following as "product: Product;" then the variable "product" will be undefined
        initially. HTML part of this component will have an undefined "product" variable until the async
        call of the method "handleProductDetails()" returns and sets the value to the "product" variable
        and angular refreshes the page.

        From users point of view everything will seem okay but if we check the browser console we will see
        error logs stating something like "product.imageUrl not defined".
    */
    product: Product = new Product();

    constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => { this.handleProductDetails(); });
    }

    handleProductDetails() {
        const productId: number = +this.route.snapshot.paramMap.get('id');

        this.productService.getProduct(productId).subscribe(
            data => { this.product = data; }
        );
    }

    addToCart() {
        console.log(`Adding to cart: ${this.product.name} (of $${this.product.unitPrice})`);

        // Adding to cart.
        const cartItem = new CartItem(this.product);
        this.cartService.addToCart(cartItem);
    }

}
