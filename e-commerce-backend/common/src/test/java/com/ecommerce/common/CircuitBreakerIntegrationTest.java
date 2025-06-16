package com.ecommerce.common;

import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class CircuitBreakerIntegrationTest {
    
    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;
    
    private CircuitBreaker circuitBreaker;
    
    @BeforeEach
    void setUp() {
        circuitBreaker = circuitBreakerRegistry.circuitBreaker("testCircuitBreaker");
    }
    
    @Test
    void shouldOpenCircuitBreakerAfterFailureThreshold() {
        // Given
        int failureThreshold = 5;
        int calls = 10;
        
        // When
        for (int i = 0; i < calls; i++) {
            try {
                circuitBreaker.executeSupplier(() -> {
                    throw new RuntimeException("Test exception");
                });
            } catch (Exception e) {
                // Expected
            }
        }
        
        // Then
        assertThat(circuitBreaker.getState()).isEqualTo(CircuitBreaker.State.OPEN);
    }
    
    @Test
    void shouldCloseCircuitBreakerAfterSuccessfulCalls() {
        // Given
        circuitBreaker.transitionToOpenState();
        
        // When
        for (int i = 0; i < 10; i++) {
            circuitBreaker.executeSupplier(() -> "Success");
        }
        
        // Then
        assertThat(circuitBreaker.getState()).isEqualTo(CircuitBreaker.State.CLOSED);
    }
}
