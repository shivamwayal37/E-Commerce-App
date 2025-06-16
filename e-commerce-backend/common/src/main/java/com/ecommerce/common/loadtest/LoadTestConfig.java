package com.ecommerce.common.loadtest;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
@Profile("load-test")
public class LoadTestConfig {
    
    private static final int THREAD_POOL_SIZE = 100; // Adjust based on system capacity
    
    @Bean
    public ExecutorService loadTestExecutor() {
        return Executors.newFixedThreadPool(THREAD_POOL_SIZE);
    }

    @Bean
    public LoadTestRunner loadTestRunner() {
        return new LoadTestRunner();
    }

    public static class LoadTestRunner {
        private final ExecutorService executor;
        private final LoadTestService loadTestService;

        public LoadTestRunner(ExecutorService executor, LoadTestService loadTestService) {
            this.executor = executor;
            this.loadTestService = loadTestService;
        }

        public void runLoadTest(int numberOfUsers, int durationSeconds) {
            for (int i = 0; i < numberOfUsers; i++) {
                executor.submit(() -> {
                    try {
                        loadTestService.simulateUserActivity(durationSeconds);
                    } catch (Exception e) {
                        // Log error but continue with other users
                        System.err.println("Error in load test thread: " + e.getMessage());
                    }
                });
            }
        }
    }
}
