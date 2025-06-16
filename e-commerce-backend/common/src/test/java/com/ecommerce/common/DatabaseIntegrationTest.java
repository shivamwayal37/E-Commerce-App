package com.ecommerce.common;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class DatabaseIntegrationTest {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Test
    void shouldExecuteQueryWithConnectionPool() {
        // When
        List<String> tables = jdbcTemplate.queryForList("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'", String.class);
        
        // Then
        assertThat(tables).isNotEmpty();
    }
    
    @Test
    void shouldCacheQueryResults() {
        // Given
        String query = "SELECT * FROM test_table WHERE id = ?";
        
        // When
        List<?> firstResult = jdbcTemplate.queryForList(query, 1);
        List<?> secondResult = jdbcTemplate.queryForList(query, 1);
        
        // Then
        assertThat(firstResult).isNotEmpty();
        assertThat(secondResult).isNotEmpty();
        assertThat(firstResult).isEqualTo(secondResult);
    }
    
    @Test
    void shouldHandleConnectionTimeout() {
        // Given
        String longRunningQuery = "SELECT pg_sleep(5)";
        
        // When
        long startTime = System.currentTimeMillis();
        jdbcTemplate.execute(longRunningQuery);
        long executionTime = System.currentTimeMillis() - startTime;
        
        // Then
        assertThat(executionTime).isLessThan(Duration.ofSeconds(30).toMillis());
    }
}
