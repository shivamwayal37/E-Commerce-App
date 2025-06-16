package com.ecommerce.common.security.threat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

@Component
@Slf4j
@RequiredArgsConstructor
public class BasicThreatDetector {
    
    private static final Set<String> SUSPICIOUS_IPS = new HashSet<>();
    private static final Set<String> SUSPICIOUS_USER_AGENTS = new HashSet<>();
    private static final Pattern SQL_INJECTION_PATTERN = 
        Pattern.compile("[\-\+\*\%\&\|\^~<>!@#$\\[\\]{}()]+", Pattern.CASE_INSENSITIVE);
    private static final Pattern XSS_PATTERN = Pattern.compile("[<>""'&=;()]+", Pattern.CASE_INSENSITIVE);
    
    static {
        // Add known malicious IPs
        SUSPICIOUS_IPS.add("127.0.0.1");  // Example malicious IP
        
        // Add suspicious user agents
        SUSPICIOUS_USER_AGENTS.add("sqlmap");
        SUSPICIOUS_USER_AGENTS.add("nikto");
    }

    public boolean isThreatDetected(HttpServletRequest request) {
        // Check for suspicious IP
        if (isSuspiciousIp(request.getRemoteAddr())) {
            log.warn("Threat detected: Suspicious IP address");
            return true;
        }
        
        // Check for suspicious user agent
        if (isSuspiciousUserAgent(request.getHeader("User-Agent"))) {
            log.warn("Threat detected: Suspicious user agent");
            return true;
        }
        
        // Check for SQL injection attempts
        if (containsSqlInjection(request.getParameterMap())) {
            log.warn("Threat detected: Possible SQL injection attempt");
            return true;
        }
        
        // Check for XSS attempts
        if (containsXss(request.getParameterMap())) {
            log.warn("Threat detected: Possible XSS attempt");
            return true;
        }
        
        return false;
    }

    private boolean isSuspiciousIp(String ip) {
        return SUSPICIOUS_IPS.contains(ip);
    }

    private boolean isSuspiciousUserAgent(String userAgent) {
        if (userAgent == null) return false;
        
        for (String suspiciousAgent : SUSPICIOUS_USER_AGENTS) {
            if (userAgent.toLowerCase().contains(suspiciousAgent)) {
                return true;
            }
        }
        return false;
    }

    private boolean containsSqlInjection(Object[] parameters) {
        if (parameters == null) return false;
        
        for (Object param : parameters) {
            if (param instanceof String && 
                SQL_INJECTION_PATTERN.matcher((String) param).find()) {
                return true;
            }
        }
        return false;
    }

    private boolean containsXss(Object[] parameters) {
        if (parameters == null) return false;
        
        for (Object param : parameters) {
            if (param instanceof String && 
                XSS_PATTERN.matcher((String) param).find()) {
                return true;
            }
        }
        return false;
    }
}
