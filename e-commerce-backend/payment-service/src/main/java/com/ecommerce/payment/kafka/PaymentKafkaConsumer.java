package com.ecommerce.payment.kafka;

import com.ecommerce.common.kafka.event.OrderEvent;
import com.ecommerce.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentKafkaConsumer {

    private final PaymentService paymentService;

    @KafkaListener(topics = "ecommerce.orders", groupId = "payment-group")
    public void listenOrderEvents(OrderEvent orderEvent) {
        if (orderEvent.getStatus().equals("PENDING")) {
            // Process payment
            boolean paymentSuccess = paymentService.processPayment(
                orderEvent.getUserId(),
                orderEvent.getTotalAmount(),
                orderEvent.getOrderId()
            );
            
            if (paymentSuccess) {
                // Update order status
                orderEvent.setStatus("COMPLETED");
            } else {
                orderEvent.setStatus("FAILED");
            }
        }
    }
}
