package com.ecommerce.common.cache;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    
    private static final String PRODUCT_CACHE = "products";
    private static final String CART_CACHE = "carts";
    private static final String ORDER_CACHE = "orders";
    private static final String USER_CACHE = "users";

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            PRODUCT_CACHE,
            CART_CACHE,
            ORDER_CACHE,
            USER_CACHE
        );
    }

    @Bean
    public ProductCache productCache() {
        return new ProductCache();
    }

    @Bean
    public CartCache cartCache() {
        return new CartCache();
    }

    @Bean
    public OrderCache orderCache() {
        return new OrderCache();
    }

    @Bean
    public UserCache userCache() {
        return new UserCache();
    }
}
