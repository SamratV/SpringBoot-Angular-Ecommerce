import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Product } from 'src/app/common/product';
import { ProductCategory } from 'src/app/common/product-category';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    // private baseUrl = 'http://localhost:8080/api/products?size=100';
    // (size = 100) => Return 100 items per page.
    // By default Spring Data REST returns only 20 items.
    private baseUrl = 'http://localhost:8080/api/products';

    private categoryUrl = 'http://localhost:8080/api/product-category';

    constructor(private httpClient: HttpClient) { }

    getProductCategories(): Observable<ProductCategory[]> {
        return this.httpClient.get<GetResponseCategories>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }

    getProductListPaginated(
        pageNo: number,
        pageSize: number,
        categoryId: number
    ): Observable<GetResponseProducts> {
        const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${pageNo}&size=${pageSize}`;
        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    searchProductsPaginated(
        pageNo: number,
        pageSize: number,
        keyword: string
    ): Observable<GetResponseProducts> {
        const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${pageNo}&size=${pageSize}`;
        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    /*
    UNPAGINATED WAY OF ACCESSING "product list" AND "search results".

    getProductList(categoryId: number): Observable<Product[]> {
        const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
        return this.getProducts(searchUrl);
    }

    searchProducts(keyword: string): Observable<Product[]> {
        const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
        return this.getProducts(searchUrl);
    }

    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
            map(response => response._embedded.products)
        );
    }
    */

    getProduct(productId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/${productId}`;
        return this.httpClient.get<Product>(productUrl);
    }
}

interface GetResponseProducts {
    _embedded: {
        products: Product[];
    },
    page: {
        /*
            size:           No of items in a page or page-size.
            totalElements:  No of items in total.
            totalPages:     No of pages in total.
            number:         Current page no.

            Exactly as represented in the Spring Data Rest response.
        */
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}

interface GetResponseCategories {
    _embedded: {
        productCategory: ProductCategory[];
    }
}
