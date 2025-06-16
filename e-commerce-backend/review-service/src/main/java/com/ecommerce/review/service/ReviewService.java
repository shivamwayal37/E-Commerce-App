package com.ecommerce.review.service;

import com.ecommerce.review.model.Review;
import com.ecommerce.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ProductClient productClient;
    private final UserClient userClient;

    @Transactional
    public void addReview(String userId, String productId, Review review) {
        // Validate product exists
        if (!productClient.productExists(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        
        // Validate user exists
        if (!userClient.userExists(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        // Validate rating range
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new InvalidRequestException("Invalid rating value");
        }
        
        review.setUserId(userId);
        review.setProductId(productId);
        review.setCreatedAt(LocalDateTime.now());
        
        reviewRepository.save(review);
    }

    @Cacheable(value = "reviews", key = "#productId")
    public List<Review> getProductReviews(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Cacheable(value = "ratings", key = "#productId")
    public double getAverageRating(String productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        if (reviews.isEmpty()) return 0.0;
        
        double totalRating = reviews.stream()
            .mapToDouble(Review::getRating)
            .sum();
        
        return totalRating / reviews.size();
    }
}
