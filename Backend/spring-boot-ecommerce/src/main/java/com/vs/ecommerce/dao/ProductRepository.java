package com.vs.ecommerce.dao;

import com.vs.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Default URL: "/products"
 * Reason: Here the entity in use is "Product". URL is always the lowercase pluralised form of the entity name.
 *
 * Overall URL: http://localhost:8080/api/products (<DOMAIN-NAME>/<BASE-PATH>/products)
 * Note: <BASE-PATH> is specified in the "application.properties" file.
 */

// @CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Example URL: http://localhost:8080/api/products/search/findByCategoryId?id=1&page=0&size=5
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    // Example URL: http://localhost:8080/api/products/search/findByNameContaining?name=python&page=0&size=5
    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);

}
