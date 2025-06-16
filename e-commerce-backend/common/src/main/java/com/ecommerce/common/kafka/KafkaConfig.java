package com.ecommerce.common.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    
    private static final String ORDER_TOPIC = "ecommerce.orders";
    private static final String CART_TOPIC = "ecommerce.cart";
    private static final String PRODUCT_TOPIC = "ecommerce.products";
    private static final String USER_TOPIC = "ecommerce.users";

    @Bean
    public NewTopic orderTopic() {
        return TopicBuilder.name(ORDER_TOPIC)
            .partitions(3)
            .replicas(1)
            .build();
    }

    @Bean
    public NewTopic cartTopic() {
        return TopicBuilder.name(CART_TOPIC)
            .partitions(3)
            .replicas(1)
            .build();
    }

    @Bean
    public NewTopic productTopic() {
        return TopicBuilder.name(PRODUCT_TOPIC)
            .partitions(3)
            .replicas(1)
            .build();
    }

    @Bean
    public NewTopic userTopic() {
        return TopicBuilder.name(USER_TOPIC)
            .partitions(3)
            .replicas(1)
            .build();
    }
}
