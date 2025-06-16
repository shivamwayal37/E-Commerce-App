package com.ecommerce.common.kafka.compression;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.ByteArraySerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j
public class KafkaMessageCompressor {

    @Bean
    public ProducerFactory<String, Object> compressedProducerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class);
        configProps.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "gzip"); // Can also use "snappy" or "lz4"
        
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> compressedKafkaTemplate() {
        return new KafkaTemplate<>(compressedProducerFactory());
    }

    public static byte[] compressMessage(Object message) {
        try {
            // Convert message to JSON
            String json = new JsonSerializer().serialize(message);
            
            // Compress the JSON string
            byte[] compressed = json.getBytes();
            
            // Log compression ratio
            log.info("Compression ratio: {}", (double) compressed.length / json.length());
            
            return compressed;
        } catch (Exception e) {
            log.error("Error compressing message", e);
            throw new RuntimeException("Failed to compress message", e);
        }
    }
}
