package com.ecommerce.wishlist.service;

import com.ecommerce.wishlist.model.WishlistItem;
import com.ecommerce.wishlist.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WishlistService {
    
    private final WishlistRepository wishlistRepository;
    private final ProductClient productClient;

    @Transactional
    public void addToWishlist(String userId, String productId) {
        // Check if product exists
        Optional<Product> product = productClient.getProductById(productId);
        if (!product.isPresent()) {
            throw new ResourceNotFoundException("Product not found");
        }
        
        // Check if item already exists
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new InvalidRequestException("Product already in wishlist");
        }
        
        // Create and save wishlist item
        WishlistItem item = new WishlistItem();
        item.setUserId(userId);
        item.setProductId(productId);
        item.setProductName(product.get().getName());
        item.setProductPrice(product.get().getPrice());
        
        wishlistRepository.save(item);
    }

    @Cacheable(value = "wishlist", key = "#userId")
    public List<WishlistItem> getWishlist(String userId) {
        return wishlistRepository.findByUserId(userId);
    }

    @Transactional
    public void removeFromWishlist(String userId, String productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}
