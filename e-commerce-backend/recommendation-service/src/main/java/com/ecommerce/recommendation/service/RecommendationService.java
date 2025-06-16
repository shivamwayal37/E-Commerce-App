package com.ecommerce.recommendation.service;

import com.ecommerce.recommendation.model.Recommendation;
import com.ecommerce.recommendation.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    
    private final RecommendationRepository recommendationRepository;
    private final ProductClient productClient;
    private final UserClient userClient;
    
    @Cacheable(value = "recommendations", key = "#userId")
    public List<Recommendation> getRecommendedProducts(String userId) {
        // Get user's purchase history
        List<String> purchasedProducts = userClient.getPurchasedProducts(userId);
        
        // Get similar products based on purchase history
        List<String> similarProducts = getSimilarProducts(purchasedProducts);
        
        return similarProducts.stream()
            .map(productId -> {
                Recommendation recommendation = new Recommendation();
                recommendation.setProductId(productId);
                recommendation.setProductName(productClient.getProductName(productId));
                recommendation.setProductPrice(productClient.getProductPrice(productId));
                return recommendation;
            })
            .collect(Collectors.toList());
    }
    
    @Cacheable(value = "similarProducts", key = "#productId")
    public List<Recommendation> getSimilarProducts(String productId) {
        // Get product category
        String category = productClient.getProductCategory(productId);
        
        // Get products in same category
        List<String> similarProducts = productClient.getProductsByCategory(category);
        
        return similarProducts.stream()
            .map(similarProductId -> {
                Recommendation recommendation = new Recommendation();
                recommendation.setProductId(similarProductId);
                recommendation.setProductName(productClient.getProductName(similarProductId));
                recommendation.setProductPrice(productClient.getProductPrice(similarProductId));
                return recommendation;
            })
            .collect(Collectors.toList());
    }
    
    private List<String> getSimilarProducts(List<String> purchasedProducts) {
        // Implement recommendation algorithm
        // For now, return products from same categories
        return purchasedProducts.stream()
            .map(productId -> productClient.getProductCategory(productId))
            .distinct()
            .flatMap(category -> productClient.getProductsByCategory(category).stream())
            .distinct()
            .collect(Collectors.toList());
    }
}
