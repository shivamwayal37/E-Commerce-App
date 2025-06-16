package com.ecommerce.common.kafka.event;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderEvent extends KafkaEvent {
    private String orderId;
    private String userId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    private String status;
    private String paymentId;

    @Data
    public static class OrderItem {
        private String productId;
        private int quantity;
        private BigDecimal price;
    }
}
