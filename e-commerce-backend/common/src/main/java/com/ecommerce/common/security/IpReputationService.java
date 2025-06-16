package com.ecommerce.common.security;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class IpReputationService {
    
    private final Map<String, IpReputation> ipReputationCache = new ConcurrentHashMap<>();
    private final Map<String, Integer> ipRequestCount = new ConcurrentHashMap<>();
    
    @Cacheable(value = "ipReputation", key = "#ipAddress")
    public IpReputation checkIpReputation(String ipAddress) {
        IpReputation reputation = ipReputationCache.get(ipAddress);
        if (reputation == null) {
            reputation = fetchIpReputationFromExternalService(ipAddress);
            ipReputationCache.put(ipAddress, reputation);
        }
        return reputation;
    }
    
    public void recordRequest(String ipAddress) {
        ipRequestCount.merge(ipAddress, 1, Integer::sum);
        
        // Check if IP has exceeded rate limit
        if (ipRequestCount.get(ipAddress) > 100) {
            IpReputation reputation = ipReputationCache.get(ipAddress);
            if (reputation != null) {
                reputation.setSuspicious(true);
                ipReputationCache.put(ipAddress, reputation);
            }
        }
    }
    
    @Scheduled(fixedRate = 60000) // Every minute
    public void cleanupIpReputationCache() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(5);
        ipReputationCache.entrySet().removeIf(entry -> 
            entry.getValue().getLastChecked().isBefore(threshold)
        );
        
        // Reset request counts
        ipRequestCount.clear();
    }
    
    private IpReputation fetchIpReputationFromExternalService(String ipAddress) {
        // This would typically call an external IP reputation service
        // For now, we'll simulate it
        return IpReputation.builder()
            .ipAddress(ipAddress)
            .reputationScore(100)
            .lastChecked(LocalDateTime.now())
            .build();
    }
}
