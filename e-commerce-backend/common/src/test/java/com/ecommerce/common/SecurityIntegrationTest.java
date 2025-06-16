package com.ecommerce.common;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class SecurityIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldReturnUnauthorizedWithoutToken() {
        // When
        ResponseEntity<String> response = restTemplate.getForEntity("/api/auth/test", String.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
    
    @Test
    void shouldReturnForbiddenWithInvalidToken() {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer invalid-token");
        
        // When
        ResponseEntity<String> response = restTemplate.exchange(
            "/api/auth/test",
            HttpMethod.GET,
            new HttpEntity<>(headers),
            String.class
        );
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }
    
    @Test
    void shouldReturnSuccessWithValidToken() {
        // Given
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer valid-token");
        
        // When
        ResponseEntity<String> response = restTemplate.exchange(
            "/api/auth/test",
            HttpMethod.GET,
            new HttpEntity<>(headers),
            String.class
        );
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
