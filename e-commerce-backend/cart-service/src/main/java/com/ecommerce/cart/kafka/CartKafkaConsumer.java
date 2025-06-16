package com.ecommerce.cart.kafka;

import com.ecommerce.common.kafka.event.OrderEvent;
import com.ecommerce.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartKafkaConsumer {

    private final CartService cartService;

    @KafkaListener(topics = "ecommerce.orders", groupId = "cart-group")
    public void listenOrderEvents(OrderEvent orderEvent) {
        if (orderEvent.getStatus().equals("COMPLETED")) {
            // Clear cart after successful order
            cartService.clearCart(orderEvent.getUserId());
        }
    }
}
