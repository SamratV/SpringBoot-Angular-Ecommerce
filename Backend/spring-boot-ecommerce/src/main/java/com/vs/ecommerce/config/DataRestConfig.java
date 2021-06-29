package com.vs.ecommerce.config;

import com.vs.ecommerce.entity.Country;
import com.vs.ecommerce.entity.Product;
import com.vs.ecommerce.entity.ProductCategory;
import com.vs.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        // disable HTTP methods for Product: PUT, POST and DELETE
        disableHttpMethods(Product.class, config, unsupportedActions);

        // disable HTTP methods for ProductCategory: PUT, POST and DELETE
        disableHttpMethods(ProductCategory.class, config, unsupportedActions);

        // disable HTTP methods for Country: PUT, POST and DELETE
        disableHttpMethods(Country.class, config, unsupportedActions);

        // disable HTTP methods for State: PUT, POST and DELETE
        disableHttpMethods(State.class, config, unsupportedActions);

        exposeIds(config);
    }

    private void disableHttpMethods(Class<?> _class, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(_class)
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        // Expose entity ids:

        // 1) Gets a list of all entity classes from the entity manager.
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // 2) Create an array of the entity types.
        List<Class<?>> entityClasses = new ArrayList<>();

        // 3) Get the entity types for the entities.
        for(EntityType<?> tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // 4) Expose the entity ids for the array of entity/domain types.
        Class<?>[] domainTypes = entityClasses.toArray(Class[]::new);
        config.exposeIdsFor(domainTypes);
    }

}
