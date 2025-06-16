package com.ecommerce.common.security.network;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class NetworkSecurityFilter extends OncePerRequestFilter {
    
    private static final Set<String> ALLOWED_METHODS = new HashSet<>();
    private static final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>();
    
    static {
        ALLOWED_METHODS.add("GET");
        ALLOWED_METHODS.add("POST");
        ALLOWED_METHODS.add("PUT");
        ALLOWED_METHODS.add("DELETE");
        ALLOWED_METHODS.add("OPTIONS");
        
        ALLOWED_CONTENT_TYPES.add("application/json");
        ALLOWED_CONTENT_TYPES.add("application/x-www-form-urlencoded");
        ALLOWED_CONTENT_TYPES.add("multipart/form-data");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) 
        throws ServletException, IOException {
        
        // Check HTTP method
        if (!ALLOWED_METHODS.contains(request.getMethod())) {
            log.warn("Blocked request with invalid method: {}", request.getMethod());
            response.setStatus(HttpServletResponse.SC_METHOD_NOT_ALLOWED);
            response.getWriter().write("Method not allowed");
            return;
        }
        
        // Check content type
        String contentType = request.getContentType();
        if (contentType != null && !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            log.warn("Blocked request with invalid content type: {}", contentType);
            response.setStatus(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE);
            response.getWriter().write("Unsupported media type");
            return;
        }
        
        // Check for suspicious headers
        if (isSuspiciousRequest(request)) {
            log.warn("Blocked suspicious request from: {}", request.getRemoteAddr());
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid request");
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private boolean isSuspiciousRequest(HttpServletRequest request) {
        // Check for suspicious headers
        if (request.getHeader("X-Forwarded-For") != null) {
            return true;
        }
        
        // Check for proxy headers
        if (request.getHeader("Via") != null) {
            return true;
        }
        
        // Check for suspicious user agent
        String userAgent = request.getHeader("User-Agent");
        if (userAgent != null && 
            (userAgent.contains("curl") || userAgent.contains("wget"))) {
            return true;
        }
        
        return false;
    }
}
