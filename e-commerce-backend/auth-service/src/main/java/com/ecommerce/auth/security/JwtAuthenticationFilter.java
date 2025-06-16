package com.ecommerce.auth.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collection;
import java.util.Collections;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String token = extractJwtFromRequest(request);
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            
            // Create a default authority for now
            Collection<? extends GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("USER"));
            Authentication authentication = new JwtAuthentication(token, "anonymous", authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken;
        }
        return null;
    }

    private static class JwtAuthentication implements Authentication {
        private final String token;
        private final String username;
        private final Collection<? extends GrantedAuthority> authorities;
        
        public JwtAuthentication(String token, String username, Collection<? extends GrantedAuthority> authorities) {
            this.token = token;
            this.username = username;
            this.authorities = authorities;
        }
        
        @Override
        public Object getCredentials() {
            return token;
        }
        
        @Override
        public Object getDetails() {
            return null;
        }
        
        @Override
        public Object getPrincipal() {
            return username;
        }
        
        @Override
        public boolean isAuthenticated() {
            return true;
        }
        
        @Override
        public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
            if (!isAuthenticated) {
                throw new IllegalArgumentException("Cannot set authentication to false");
            }
        }
        
        @Override
        public String getName() {
            return username;
        }
        
        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }
    }
}
