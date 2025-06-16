package com.ecommerce.common.kafka.handler;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.listener.ConsumerAwareErrorHandler;
import org.springframework.kafka.listener.ListenerExecutionFailedException;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class KafkaErrorHandler implements ConsumerAwareErrorHandler {

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_INTERVAL = 1000L; // 1 second

    @Override
    public void handle(Exception thrownException, ConsumerRecord<?, ?> data) {
        if (thrownException instanceof ListenerExecutionFailedException) {
            ListenerExecutionFailedException lefe = (ListenerExecutionFailedException) thrownException;
            
            if (lefe.getCause() instanceof RuntimeException) {
                // Retry mechanism
                int retryCount = data.headers().lastHeader("retryCount") != null ? 
                    Integer.parseInt(new String(data.headers().lastHeader("retryCount").value())) : 0;
                
                if (retryCount < MAX_RETRIES) {
                    log.warn("Retrying message {} - attempt {}", data.value(), retryCount + 1);
                    // Retry after delay
                    try {
                        Thread.sleep(RETRY_INTERVAL);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Interrupted while retrying", e);
                    }
                    // Send back to topic
                } else {
                    log.error("Failed to process message after {} retries. Moving to DLQ", MAX_RETRIES);
                    // Move to DLQ
                }
            } else {
                log.error("Failed to process message: {}", data.value(), thrownException);
            }
        } else {
            log.error("Unexpected exception while processing message", thrownException);
        }
    }
}
