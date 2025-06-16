package com.ecommerce.common.rate;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {
    
    private static final int MAX_REQUESTS_PER_MINUTE = 1000;
    private static final long WINDOW_SIZE_MS = 60 * 1000; // 1 minute
    
    private final ConcurrentHashMap<String, RateLimitWindow> rateLimitWindows = 
        new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) 
        throws ServletException, IOException {
        
        String clientId = getClientId(request);
        RateLimitWindow window = rateLimitWindows.computeIfAbsent(
            clientId, 
            k -> new RateLimitWindow()
        );
        
        if (!window.allowRequest()) {
            response.setStatus(HttpServletResponse.SC_TOO_MANY_REQUESTS);
            response.getWriter().write("Rate limit exceeded");
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private String getClientId(HttpServletRequest request) {
        // Implement client ID extraction logic
        // This could be based on IP address, API key, or other identifier
        return request.getRemoteAddr();
    }

    private static class RateLimitWindow {
        private final ConcurrentHashMap<Long, Integer> requestCounts = 
            new ConcurrentHashMap<>();
        private int currentCount = 0;
        
        public boolean allowRequest() {
            long currentTime = Instant.now().toEpochMilli();
            long currentWindow = currentTime / WINDOW_SIZE_MS;
            
            // Remove old windows
            requestCounts.keySet().removeIf(window -> 
                window < currentWindow - 1
            );
            
            // Get or create count for current window
            currentCount = requestCounts.compute(currentWindow, 
                (window, value) -> value == null ? 1 : value + 1
            );
            
            return currentCount <= MAX_REQUESTS_PER_MINUTE;
        }
    }
}
