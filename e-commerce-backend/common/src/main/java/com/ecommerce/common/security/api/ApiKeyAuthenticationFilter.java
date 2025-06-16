package com.ecommerce.common.security.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {
    
    @Value("${security.api.keys}")
    private String apiKeysCsv;
    
    private Set<String> validApiKeys;
    
    @Override
    protected void initFilterBean() throws ServletException {
        super.initFilterBean();
        validApiKeys = new HashSet<>();
        if (apiKeysCsv != null && !apiKeysCsv.isEmpty()) {
            String[] keys = apiKeysCsv.split(",");
            for (String key : keys) {
                validApiKeys.add(key.trim());
            }
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) 
        throws ServletException, IOException {
        
        String apiKey = request.getHeader("X-API-Key");
        
        if (apiKey == null || !validApiKeys.contains(apiKey)) {
            log.warn("Invalid API key: {}", apiKey);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid API key");
            return;
        }
        
        filterChain.doFilter(request, response);
    }
}
