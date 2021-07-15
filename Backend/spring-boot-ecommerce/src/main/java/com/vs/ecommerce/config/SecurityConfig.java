package com.vs.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Okta Oauth2 configurations. For protecting APIs
 * that should not be accessed by unauthenticated
 * users. Basically "OrderRepository".
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private static final String ENDPOINT = "/api/orders/**";

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Protect endpoint: /api/orders
        http.authorizeRequests().antMatchers(ENDPOINT)
        .authenticated().and().oauth2ResourceServer().jwt();

        // Add CORS filters
        http.cors();

        // Force a non-empty response body for
        // 401's to make the response more friendly.
        Okta.configureResourceServer401ResponseBody(http);

        // Disable CSRF since we aren't
        // using cookies for session tracking.
        http.csrf().disable();
    }
}
