package com.ecommerce.common.kafka.ratelimit;

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
public class RateLimiter {
    
    private static final int MAX_REQUESTS_PER_MINUTE = 1000;
    private static final long WINDOW_SIZE_MS = 60 * 1000; // 1 minute
    
    private final ConcurrentHashMap<String, RateLimitWindow> rateLimitWindows = 
        new ConcurrentHashMap<>();
    
    public boolean isAllowed(KafkaEvent event) {
        String clientId = getClientId(event);
        RateLimitWindow window = rateLimitWindows.computeIfAbsent(
            clientId, 
            k -> new RateLimitWindow()
        );
        
        return window.isAllowed();
    }
    
    private String getClientId(KafkaEvent event) {
        // Implement client ID extraction logic
        return event.getSourceService();
    }
    
    private static class RateLimitWindow {
        private final ConcurrentHashMap<Long, Integer> requestCounts = 
            new ConcurrentHashMap<>();
        
        public boolean isAllowed() {
            long currentTime = Instant.now().toEpochMilli();
            long currentWindow = currentTime / WINDOW_SIZE_MS;
            
            // Remove old windows
            requestCounts.keySet().removeIf(window -> 
                window < currentWindow - 1
            );
            
            // Get or create count for current window
            int count = requestCounts.compute(currentWindow, 
                (window, value) -> value == null ? 1 : value + 1
            );
            
            return count <= MAX_REQUESTS_PER_MINUTE;
        }
    }
}
