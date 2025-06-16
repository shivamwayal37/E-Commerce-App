package com.ecommerce.inventory.service;

import com.ecommerce.inventory.model.Inventory;
import com.ecommerce.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;
    private final ProductClient productClient;
    
    @Transactional
    public void updateInventory(String productId, int quantity) {
        Optional<Inventory> inventory = inventoryRepository.findByProductId(productId);
        
        if (!inventory.isPresent()) {
            throw new ResourceNotFoundException("Inventory not found");
        }
        
        Inventory inv = inventory.get();
        int newQuantity = inv.getQuantity() + quantity;
        
        if (newQuantity < 0) {
            throw new InvalidRequestException("Insufficient stock");
        }
        
        inv.setQuantity(newQuantity);
        inventoryRepository.save(inv);
        
        // Send inventory update event
        sendInventoryUpdateEvent(productId, newQuantity);
    }
    
    @Cacheable(value = "stock", key = "#productId")
    public boolean checkStockAvailability(String productId, int requiredQuantity) {
        Optional<Inventory> inventory = inventoryRepository.findByProductId(productId);
        
        if (!inventory.isPresent()) {
            return false;
        }
        
        return inventory.get().getQuantity() >= requiredQuantity;
    }
    
    @Async
    private void sendInventoryUpdateEvent(String productId, int newQuantity) {
        // Implement event publishing logic
        // This could be Kafka or other messaging system
    }
}
