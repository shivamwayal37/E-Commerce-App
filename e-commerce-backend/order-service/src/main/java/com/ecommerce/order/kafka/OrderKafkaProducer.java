package com.ecommerce.order.kafka;

import com.ecommerce.common.kafka.KafkaTemplate;
import com.ecommerce.common.kafka.event.OrderEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderKafkaProducer {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String ORDER_TOPIC = "ecommerce.orders";

    public void sendOrderEvent(OrderEvent orderEvent) {
        kafkaTemplate.send(ORDER_TOPIC, orderEvent.getOrderId(), orderEvent);
    }
}
