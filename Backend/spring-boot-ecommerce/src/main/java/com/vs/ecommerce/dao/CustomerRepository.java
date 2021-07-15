package com.vs.ecommerce.dao;

import com.vs.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

// This JPA Repository is part of custom REST APIs, i.e, all the controllers.
// That is why there is no "@RepositoryRestResource" annotation here.
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmail(String email);
}
