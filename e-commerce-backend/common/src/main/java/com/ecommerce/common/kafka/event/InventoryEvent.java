package com.ecommerce.common.kafka.event;

import lombok.Data;

@Data
public class InventoryEvent extends KafkaEvent {
    private String productId;
    private int currentStock;
    private int threshold;
    private boolean outOfStock;
    
    public enum EventType {
        STOCK_UPDATED,
        STOCK_LOW,
        STOCK_OUT,
        STOCK_ADJUSTED,
        STOCK_REORDER
    }
}
