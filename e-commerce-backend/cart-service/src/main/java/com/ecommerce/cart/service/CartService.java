package com.ecommerce.cart.service;

import com.ecommerce.cart.model.Cart;
import com.ecommerce.cart.model.CartItem;
import com.ecommerce.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartRepository cartRepository;
    private final ProductClient productClient;

    public Cart getCart(String userId) {
        return cartRepository.findByUserId(userId)
            .orElseGet(() -> createNewCart(userId));
    }

    private Cart createNewCart(String userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        return cartRepository.save(cart);
    }

    public Cart addItemToCart(String userId, String productId, int quantity) {
        Cart cart = getCart(userId);
        CartItem existingItem = cart.getItems().stream()
            .filter(item -> item.getProductId().equals(productId))
            .findFirst()
            .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProductId(productId);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String userId, String productId) {
        Cart cart = getCart(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String userId, String productId, int quantity) {
        Cart cart = getCart(userId);
        CartItem item = cart.getItems().stream()
            .filter(i -> i.getProductId().equals(productId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        item.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public double calculateTotal(String userId) {
        Cart cart = getCart(userId);
        return cart.getItems().stream()
            .mapToDouble(item -> {
                try {
                    return productClient.getProductPrice(item.getProductId()) * item.getQuantity();
                } catch (Exception e) {
                    return 0;
                }
            })
            .sum();
    }
}
