package com.ecommerce.common.config;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableEurekaClient
@EnableDiscoveryClient
public class ServiceDiscoveryConfig {
    
    // This class is just a marker for enabling service discovery
    // Eureka configuration will be handled through application.yml
    
    // You can add additional service discovery configuration here
    // if needed, such as custom service registry configuration
}
