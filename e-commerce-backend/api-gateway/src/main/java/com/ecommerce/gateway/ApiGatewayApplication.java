package com.ecommerce.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route(r -> r.path("/auth/**")
                .filters(f -> f.stripPrefix(1))
                .uri("lb://auth-service"))
            .route(r -> r.path("/api/products/**")
                .filters(f -> f.stripPrefix(2))
                .uri("lb://product-service"))
            .route(r -> r.path("/api/cart/**")
                .filters(f -> f.stripPrefix(2))
                .uri("lb://cart-service"))
            .route(r -> r.path("/api/orders/**")
                .filters(f -> f.stripPrefix(2))
                .uri("lb://order-service"))
            .route(r -> r.path("/api/payments/**")
                .filters(f -> f.stripPrefix(2))
                .uri("lb://payment-service"))
            .build();
    }
}
