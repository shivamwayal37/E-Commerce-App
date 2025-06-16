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
import java.util.Arrays;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class EnhancedAuditLogger {
    
    @Pointcut("execution(* com.ecommerce..*.*(..))")
    public void allApplicationMethods() {}
    
    @Before("allApplicationMethods()")
    public void logBefore(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        Object[] args = joinPoint.getArgs();
        
        log.info("AUDIT: Method {} in class {} started at {} with parameters: {}", 
            methodName, className, LocalDateTime.now(), 
            Arrays.toString(args));
    }
    
    @After("allApplicationMethods()")
    public void logAfter(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringTypeName();
        
        log.info("AUDIT: Method {} in class {} completed at {}", 
            methodName, className, LocalDateTime.now());
    }
    
    public void logSecurityEvent(String eventType, String description, String userId) {
        log.warn("SECURITY: {} - {} by user {}", eventType, description, userId);
    }
    
    public void logAccessDenied(String resource, String userId) {
        logSecurityEvent("ACCESS_DENIED", "Attempted to access " + resource, userId);
    }
    
    public void logAuthentication(String action, String userId) {
        String eventType = action.equals("login") ? "AUTH_SUCCESS" : "AUTH_FAIL";
        String description = action.equals("login") ? 
            "Successfully authenticated" : "Failed authentication attempt";
        
        logSecurityEvent(eventType, description, userId);
    }
    
    public void logTransaction(String action, String userId, Double amount) {
        log.info("TRANSACTION: User {} performed {} of amount {} at {}", 
            userId, action, amount, LocalDateTime.now());
    }
    
    public void logDataAccess(String action, String userId, String resource) {
        log.info("DATA_ACCESS: User {} {} {} at {}", 
            userId, action, resource, LocalDateTime.now());
    }
}
