package com.ecommerce.order.service;

import com.ecommerce.common.kafka.event.OrderEvent;
import com.ecommerce.common.kafka.event.ProductEvent;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.kafka.OrderKafkaProducer;
import com.ecommerce.order.kafka.ProductKafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderKafkaProducer orderKafkaProducer;
    private final ProductKafkaProducer productKafkaProducer;
    private final CartClient cartClient;
    private final PaymentClient paymentClient;

    @Transactional
    public Order createOrder(String userId) {
        // Get cart items
        List<OrderItem> items = cartClient.getCartItems(userId);
        
        // Create order
        Order order = new Order();
        order.setOrderId(UUID.randomUUID().toString());
        order.setUserId(userId);
        order.setItems(items);
        order.setTotalAmount(calculateTotal(items));
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Send order event
        OrderEvent orderEvent = new OrderEvent();
        orderEvent.setOrderId(savedOrder.getOrderId());
        orderEvent.setUserId(savedOrder.getUserId());
        orderEvent.setItems(savedOrder.getItems());
        orderEvent.setTotalAmount(savedOrder.getTotalAmount());
        orderEvent.setStatus(savedOrder.getStatus());
        
        orderKafkaProducer.sendOrderEvent(orderEvent);
        
        return savedOrder;
    }

    private double calculateTotal(List<OrderItem> items) {
        return items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
    }

    public void updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(status);
        orderRepository.save(order);
        
        // Send updated order event
        OrderEvent orderEvent = new OrderEvent();
        orderEvent.setOrderId(order.getOrderId());
        orderEvent.setStatus(status);
        
        orderKafkaProducer.sendOrderEvent(orderEvent);
    }

    public void processPayment(String orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Process payment
        String paymentId = paymentClient.processPayment(
            order.getTotalAmount(),
            order.getUserId(),
            orderId
        );
        
        order.setPaymentId(paymentId);
        order.setStatus("COMPLETED");
        orderRepository.save(order);
        
        // Send payment confirmation event
        OrderEvent orderEvent = new OrderEvent();
        orderEvent.setOrderId(order.getOrderId());
        orderEvent.setStatus("COMPLETED");
        orderEvent.setPaymentId(paymentId);
        
        orderKafkaProducer.sendOrderEvent(orderEvent);
    }
}
