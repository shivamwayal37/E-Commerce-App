package com.ecommerce.product.kafka;

import com.ecommerce.common.kafka.event.OrderEvent;
import com.ecommerce.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductKafkaConsumer {

    private final ProductService productService;

    @KafkaListener(topics = "ecommerce.orders", groupId = "product-group")
    public void listenOrderEvents(OrderEvent orderEvent) {
        if (orderEvent.getStatus().equals("COMPLETED")) {
            // Update product inventory
            orderEvent.getItems().forEach(item -> {
                productService.updateInventory(item.getProductId(), -item.getQuantity());
            });
        }
    }
}
