package com.ecommerce.common.kafka.event;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public abstract class KafkaEvent {
    private String eventId;
    private LocalDateTime timestamp;
    private String eventType;
    private String sourceService;
}
