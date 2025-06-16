package com.ecommerce.common.security.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditLogger {
    
    @Pointcut("execution(* com.ecommerce..*.*(..))")
    public void allApplicationMethods() {}
    
    @Before("allApplicationMethods()")
    public void logBefore(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        
        log.info("AUDIT: Method {} in class {} started at {}", 
            methodName, className, LocalDateTime.now());
    }
    
    @After("allApplicationMethods()")
    public void logAfter(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        
        log.info("AUDIT: Method {} in class {} completed at {}", 
            methodName, className, LocalDateTime.now());
    }
    
    public void logSecurityEvent(String eventType, String description) {
        log.warn("SECURITY: {} - {}", eventType, description);
    }
    
    public void logAccessDenied(String resource, String user) {
        logSecurityEvent("ACCESS_DENIED", "User " + user + " attempted to access " + resource);
    }
    
    public void logAuthenticationFailure(String username) {
        logSecurityEvent("AUTH_FAIL", "Failed authentication attempt for user: " + username);
    }
    
    public void logSuccessfulAuthentication(String username) {
        logSecurityEvent("AUTH_SUCCESS", "Successful authentication for user: " + username);
    }
}
