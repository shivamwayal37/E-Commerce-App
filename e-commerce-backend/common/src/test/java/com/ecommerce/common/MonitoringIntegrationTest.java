package com.ecommerce.common;

import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class MonitoringIntegrationTest {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    @Test
    void shouldCollectJVMMetrics() {
        // When
        meterRegistry.get("jvm.memory.used").meter();
        
        // Then
        assertThat(meterRegistry.get("jvm.memory.used").meter()).isNotNull();
    }
    
    @Test
    void shouldCollectHTTPMetrics() {
        // When
        meterRegistry.get("http.server.requests").meter();
        
        // Then
        assertThat(meterRegistry.get("http.server.requests").meter()).isNotNull();
    }
    
    @Test
    void shouldCollectKafkaMetrics() {
        // When
        meterRegistry.get("kafka.consumer.fetch-latency.avg").meter();
        
        // Then
        assertThat(meterRegistry.get("kafka.consumer.fetch-latency.avg").meter()).isNotNull();
    }
    
    @Test
    void shouldCollectCustomMetrics() {
        // When
        meterRegistry.counter("custom.metric.name").increment();
        
        // Then
        assertThat(meterRegistry.get("custom.metric.name").counter().count()).isEqualTo(1.0);
    }
}
