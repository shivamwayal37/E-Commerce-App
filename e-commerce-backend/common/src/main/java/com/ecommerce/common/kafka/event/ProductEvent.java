package com.ecommerce.common.kafka.event;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductEvent extends KafkaEvent {
    private String productId;
    private String name;
    private BigDecimal price;
    private int stockQuantity;
    private String category;
    private String description;
    private String imageUrl;
    
    public enum EventType {
        PRODUCT_CREATED,
        PRODUCT_UPDATED,
        PRODUCT_DELETED,
        STOCK_UPDATED
    }
}
