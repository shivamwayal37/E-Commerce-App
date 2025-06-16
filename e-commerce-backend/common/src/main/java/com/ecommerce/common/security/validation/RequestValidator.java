package com.ecommerce.common.security.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class RequestValidator extends OncePerRequestFilter {
    
    private static final Pattern XSS_PATTERN = Pattern.compile("[<>""'&=;()]+", Pattern.CASE_INSENSITIVE);
    private static final Pattern SQL_INJECTION_PATTERN = 
        Pattern.compile("[\-\+\*\%\&\|\^~<>!@#$\\[\\]{}()]+", Pattern.CASE_INSENSITIVE);
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) 
        throws ServletException, IOException {
        
        if (isSuspiciousRequest(request)) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid request parameters");
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private boolean isSuspiciousRequest(HttpServletRequest request) {
        // Check for XSS attempts
        if (containsSuspiciousPattern(request.getParameterMap().values(), XSS_PATTERN)) {
            return true;
        }
        
        // Check for SQL injection attempts
        if (containsSuspiciousPattern(request.getParameterMap().values(), SQL_INJECTION_PATTERN)) {
            return true;
        }
        
        // Check for large payloads
        if (request.getContentLength() > 1024 * 1024) {  // 1MB limit
            return true;
        }
        
        return false;
    }

    private boolean containsSuspiciousPattern(Object[] values, Pattern pattern) {
        if (values == null) return false;
        
        for (Object value : values) {
            if (value instanceof String && pattern.matcher((String) value).find()) {
                return true;
            }
        }
        return false;
    }
}
