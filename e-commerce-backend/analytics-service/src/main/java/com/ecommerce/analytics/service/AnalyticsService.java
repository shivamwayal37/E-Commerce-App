package com.ecommerce.analytics.service;

import com.ecommerce.analytics.model.AnalyticsReport;
import com.ecommerce.analytics.repository.AnalyticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    
    private final AnalyticsRepository analyticsRepository;
    private final OrderClient orderClient;
    private final ProductClient productClient;
    private final UserClient userClient;
    
    @Cacheable(value = "analyticsReports", key = "#reportType + #startDate + #endDate")
    public AnalyticsReport generateReport(String reportType, LocalDate startDate, LocalDate endDate) {
        AnalyticsReport report = new AnalyticsReport();
        report.setReportType(reportType);
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        
        switch (reportType) {
            case "SALES":
                report.setData(generateSalesReport(startDate, endDate));
                break;
            case "PRODUCT":
                report.setData(generateProductReport(startDate, endDate));
                break;
            case "USER":
                report.setData(generateUserReport(startDate, endDate));
                break;
            default:
                throw new InvalidRequestException("Invalid report type");
        }
        
        return report;
    }
    
    @Cacheable(value = "salesAnalytics", key = "#startDate + #endDate")
    private Map<String, Object> generateSalesReport(LocalDate startDate, LocalDate endDate) {
        return Map.of(
            "totalRevenue", analyticsRepository.calculateTotalRevenue(startDate, endDate),
            "averageOrderValue", analyticsRepository.calculateAverageOrderValue(startDate, endDate),
            "orderCount", analyticsRepository.countOrders(startDate, endDate),
            "topProducts", analyticsRepository.findTopSellingProducts(startDate, endDate, 10)
        );
    }
    
    @Cacheable(value = "productAnalytics", key = "#startDate + #endDate")
    private Map<String, Object> generateProductReport(LocalDate startDate, LocalDate endDate) {
        return Map.of(
            "totalProducts", productClient.getTotalProducts(),
            "categoryDistribution", productClient.getProductCategoryDistribution(),
            "stockStatus", productClient.getStockStatus(),
            "priceDistribution", productClient.getPriceDistribution()
        );
    }
    
    @Cacheable(value = "userAnalytics", key = "#startDate + #endDate")
    private Map<String, Object> generateUserReport(LocalDate startDate, LocalDate endDate) {
        return Map.of(
            "totalUsers", userClient.getTotalUsers(),
            "newUsers", userClient.getNewUsers(startDate, endDate),
            "activeUsers", userClient.getActiveUsers(),
            "userLocation", userClient.getUserLocationDistribution()
        );
    }
    
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateAnalyticsCache() {
        // Update cache daily
        generateReport("SALES", LocalDate.now().minusDays(7), LocalDate.now());
        generateReport("PRODUCT", LocalDate.now().minusDays(7), LocalDate.now());
        generateReport("USER", LocalDate.now().minusDays(7), LocalDate.now());
    }
}
