package com.ecommerce.common.kafka.deduplication;

import com.ecommerce.common.kafka.event.KafkaEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class MessageDeduplicator {
    private final DeduplicationStore deduplicationStore;
    private static final long DEDUPLICATION_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

    public boolean shouldProcessMessage(KafkaEvent event) {
        String eventId = event.getEventId();
        String eventType = event.getEventType();
        
        // Check if event is already processed
        if (deduplicationStore.isEventProcessed(eventId, eventType)) {
            log.warn("Duplicate message detected: {} - {}", eventType, eventId);
            return false;
        }
        
        // Mark event as processed
        deduplicationStore.markAsProcessed(eventId, eventType);
        return true;
    }

    @Component
    public static class DeduplicationStore {
        private final ConcurrentHashMap<String, Instant> processedEvents = new ConcurrentHashMap<>();
        
        public boolean isEventProcessed(String eventId, String eventType) {
            String key = generateKey(eventId, eventType);
            Instant lastProcessed = processedEvents.get(key);
            
            if (lastProcessed == null) {
                return false;
            }
            
            // Check if event is within deduplication window
            return Instant.now().isBefore(lastProcessed.plusMillis(DEDUPLICATION_WINDOW_MS));
        }
        
        public void markAsProcessed(String eventId, String eventType) {
            String key = generateKey(eventId, eventType);
            processedEvents.put(key, Instant.now());
            
            // Clean up old entries
            cleanupOldEntries();
        }
        
        private String generateKey(String eventId, String eventType) {
            return eventId + ":" + eventType;
        }
        
        private void cleanupOldEntries() {
            Instant cutoff = Instant.now().minusMillis(DEDUPLICATION_WINDOW_MS);
            processedEvents.entrySet().removeIf(entry -> 
                entry.getValue().isBefore(cutoff)
            );
        }
    }
}
