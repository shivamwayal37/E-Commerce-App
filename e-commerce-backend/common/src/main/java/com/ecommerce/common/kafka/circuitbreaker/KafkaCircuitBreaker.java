package com.ecommerce.common.kafka.circuitbreaker;

import com.ecommerce.common.kafka.event.KafkaEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Slf4j
@RequiredArgsConstructor
public class KafkaCircuitBreaker {
    
    private static final int FAILURE_THRESHOLD = 5;
    private static final long RESET_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
    
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private volatile Instant lastFailure = Instant.MIN;
    private volatile boolean isOpen = false;
    
    public void recordFailure() {
        failureCount.incrementAndGet();
        lastFailure = Instant.now();
        
        if (failureCount.get() >= FAILURE_THRESHOLD) {
            isOpen = true;
            log.warn("Circuit breaker opened due to {} consecutive failures", FAILURE_THRESHOLD);
        }
    }
    
    public void recordSuccess() {
        failureCount.set(0);
        lastFailure = Instant.MIN;
        isOpen = false;
    }
    
    public boolean canProcess(KafkaEvent event) {
        if (isOpen) {
            // Check if enough time has passed to reset
            if (Instant.now().isAfter(lastFailure.plusMillis(RESET_TIMEOUT_MS))) {
                isOpen = false;
                log.info("Circuit breaker reset after timeout");
            } else {
                log.warn("Circuit breaker is open, rejecting message: {}", event.getEventId());
                return false;
            }
        }
        return true;
    }
    
    public void processWithCircuitBreaker(Runnable action) {
        if (!canProcess(null)) {
            throw new CircuitBreakerOpenException("Circuit breaker is open");
        }
        
        try {
            action.run();
            recordSuccess();
        } catch (Exception e) {
            recordFailure();
            throw e;
        }
    }
    
    public static class CircuitBreakerOpenException extends RuntimeException {
        public CircuitBreakerOpenException(String message) {
            super(message);
        }
    }
}
