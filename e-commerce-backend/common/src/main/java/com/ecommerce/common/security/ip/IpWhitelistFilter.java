package com.ecommerce.common.security.ip;

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
public class IpWhitelistFilter extends OncePerRequestFilter {
    
    @Value("${security.ip.whitelist}")
    private String whitelistCsv;
    
    private Set<String> whitelist;
    
    @Override
    protected void initFilterBean() throws ServletException {
        super.initFilterBean();
        whitelist = new HashSet<>();
        if (whitelistCsv != null && !whitelistCsv.isEmpty()) {
            String[] addresses = whitelistCsv.split(",");
            for (String address : addresses) {
                whitelist.add(address.trim());
            }
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) 
        throws ServletException, IOException {
        
        String clientIp = request.getRemoteAddr();
        
        if (whitelist.isEmpty() || whitelist.contains(clientIp)) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Access denied from IP: {}", clientIp);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Access denied: IP not whitelisted");
        }
    }
}
