package com.ecommerce.common.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.kafka.KafkaMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics;
import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import io.micrometer.core.instrument.binder.httpserver.TomcatMetrics;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.producer.Producer;
import org.springframework.boot.actuate.metrics.web.servlet.WebMvcTagsProvider;
import org.springframework.boot.actuate.metrics.web.servlet.WebMvcTags;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.servlet.tags.RequestContextAwareTag;

import java.util.Map;

@Configuration
@EnableScheduling
public class MonitoringConfig {
    
    private final MeterRegistry meterRegistry;
    
    public MonitoringConfig(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    @Bean
    public JvmMemoryMetrics jvmMemoryMetrics() {
        return new JvmMemoryMetrics();
    }
    
    @Bean
    public JvmThreadMetrics jvmThreadMetrics() {
        return new JvmThreadMetrics();
    }
    
    @Bean
    public ProcessorMetrics processorMetrics() {
        return new ProcessorMetrics();
    }
    
    @Bean
    public WebMvcTagsProvider webMvcTagsProvider() {
        return new WebMvcTagsProvider() {
            @Override
            public Iterable<Tag> getTags(HttpServletRequest request, HttpServletResponse response, Object handler, Throwable exception) {
                return WebMvcTags.tags(
                    WebMvcTags.method(request),
                    WebMvcTags.uri(request),
                    WebMvcTags.exception(exception),
                    WebMvcTags.status(response)
                );
            }
        };
    }
    
    @Bean
    public TomcatMetrics tomcatMetrics() {
        return new TomcatMetrics();
    }
    
    @Bean
    public KafkaMetrics kafkaMetrics() {
        return new KafkaMetrics();
    }
    
    @Bean
    public void initializeKafkaMetrics(Producer<String, Object> producer, 
                                      Consumer<String, Object> consumer) {
        // Add Kafka producer metrics
        new KafkaMetrics(producer).bindTo(meterRegistry);
        new KafkaProducerMetrics(producer).bindTo(meterRegistry);
        
        // Add Kafka consumer metrics
        new KafkaConsumerMetrics(consumer).bindTo(meterRegistry);
    }

    @Scheduled(fixedRate = 60000)  // Every minute
    public void reportMetrics() {
        meterRegistry.get("jvm.memory.used").meter().measure();
        meterRegistry.get("process.cpu.usage").meter().measure();
        meterRegistry.get("http.server.requests").meter().measure();
        meterRegistry.get("jvm.gc.pause").meter().measure();
    }

    @Bean
    public Map<String, String> commonTags() {
        return Map.of(
            "application", "ecommerce",
            "environment", "production"
        );
    }
}
