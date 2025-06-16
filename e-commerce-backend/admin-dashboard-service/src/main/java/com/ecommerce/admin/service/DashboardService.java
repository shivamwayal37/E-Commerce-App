package com.ecommerce.admin.service;

import com.ecommerce.admin.model.DashboardMetrics;
import com.ecommerce.admin.repository.OrderRepository;
import com.ecommerce.admin.repository.ProductRepository;
import com.ecommerce.admin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    @Cacheable(value = "dashboardMetrics", key = "#root.methodName")
    public DashboardMetrics getDashboardMetrics() {
        DashboardMetrics metrics = new DashboardMetrics();
        
        // Get total users
        metrics.setTotalUsers(userRepository.count());
        
        // Get total products
        metrics.setTotalProducts(productRepository.count());
        
        // Get total orders
        metrics.setTotalOrders(orderRepository.count());
        
        // Get revenue metrics
        metrics.setTotalRevenue(orderRepository.calculateTotalRevenue());
        metrics.setMonthlyRevenue(orderRepository.calculateMonthlyRevenue());
        
        // Get order status distribution
        metrics.setOrderStatusDistribution(orderRepository.getOrderStatusDistribution());
        
        // Get product category distribution
        metrics.setProductCategoryDistribution(productRepository.getProductCategoryDistribution());
        
        return metrics;
    }
    
    @Scheduled(cron = "0 0 * * * ?")
    public void updateMetricsCache() {
        // This will trigger cache refresh every hour
        getDashboardMetrics();
    }
    
    public List<Object[]> getTopSellingProducts(int limit) {
        return productRepository.findTopSellingProducts(limit);
    }
    
    public List<Object[]> getRecentOrders(int limit) {
        return orderRepository.findRecentOrders(limit);
    }
}
