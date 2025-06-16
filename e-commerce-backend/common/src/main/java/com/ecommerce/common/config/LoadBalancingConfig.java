package com.ecommerce.common.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class LoadBalancingConfig {
    
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    public RetryConfig retryConfig() {
        return new RetryConfig();
    }
}

public class RetryConfig {
    private static final int MAX_ATTEMPTS = 3;
    private static final long BACKOFF_PERIOD = 1000; // 1 second
    
    public int getMaxAttempts() {
        return MAX_ATTEMPTS;
    }
    
    public long getBackoffPeriod() {
        return BACKOFF_PERIOD;
    }
}
