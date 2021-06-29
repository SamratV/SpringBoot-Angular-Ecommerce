package com.vs.ecommerce.dao;

import com.vs.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

/*
*   CUSTOMIZATION (Avoiding default names):
*   ---------------------------------------
*   JSON entry name -> productCategory
*   Path -> /product-category
*
*   Example: http://localhost:8080/api/product-category
*/
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
@CrossOrigin("http://localhost:4200")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
