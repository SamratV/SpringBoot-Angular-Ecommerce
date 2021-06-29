import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products: Product[] = [];
    currentCategoryId: number = 1;
    previousCategoryId: number = 1;
    searchMode: boolean = false;
    previousKeyword: string = null;

    // Properties for pagination.
    pageNumber: number = 1;
    pageSize: number = 5;
    totalElements: number = 0;

    constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => { this.listProducts(); });
    }

    listProducts() {
        this.searchMode = this.route.snapshot.paramMap.has('keyword');

        if (this.searchMode) {
            this.handleSearchProducts();
        } else {
            this.handleListProducts();
        }
    }

    handleSearchProducts() {
        const keyword: string = this.route.snapshot.paramMap.get('keyword');

        if (this.previousKeyword != keyword) {
            this.pageNumber = 1;
        }

        this.previousKeyword = keyword;

        // In Spring, page number is zero based.
        this.productService.searchProductsPaginated(this.pageNumber - 1, this.pageSize, keyword)
            .subscribe(
                this.processResult()
            );
    }

    handleListProducts() {
        // Check if "id" parameter is available.
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if (hasCategoryId) {
            // Get the "id" (string) & convert it to a number using "+" symbol.
            this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
        } else {
            this.currentCategoryId = 1;
        }

        if (this.previousCategoryId != this.currentCategoryId) {
            this.pageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        // In Spring, page number is zero based.
        this.productService.getProductListPaginated(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
            .subscribe(
                // APPROACH 1
                // data => {
                //     this.products = data._embedded.products;
                //     this.pageNumber = data.page.number + 1; // In Angular, page number is 1 based.
                //     this.pageSize = data.page.size;
                //     this.totalElements = data.page.totalElements;
                // }

                // APPROACH 2
                this.processResult()
            );
    }

    processResult() {
        return data => {
            this.products = data._embedded.products;
            this.pageNumber = data.page.number + 1; // In Angular, page number is 1 based.
            this.pageSize = data.page.size;
            this.totalElements = data.page.totalElements;
        };
    }

    // For pagination support. Reloads the component with appropriate page content.
    updatePageSize(pageSizeValue: number) {
        this.pageSize = pageSizeValue;
        this.pageNumber = 1;
        this.listProducts();
    }

    addToCart(product: Product) {
        // console.log(`Adding to cart: ${product.name} (of $${product.unitPrice})`);

        // Adding to cart.
        const cartItem = new CartItem(product);
        this.cartService.addToCart(cartItem);
    }
}
