package com.ecommerce.product.service;

import com.ecommerce.common.kafka.event.InventoryEvent;
import com.ecommerce.common.kafka.event.ProductEvent;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.kafka.InventoryKafkaProducer;
import com.ecommerce.product.kafka.ProductKafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductKafkaProducer productKafkaProducer;
    private final InventoryKafkaProducer inventoryKafkaProducer;

    public Product createProduct(Product product) {
        Product savedProduct = productRepository.save(product);
        
        // Send product created event
        ProductEvent productEvent = new ProductEvent();
        productEvent.setProductId(savedProduct.getId());
        productEvent.setEventType(ProductEvent.EventType.PRODUCT_CREATED);
        
        productKafkaProducer.sendProductEvent(productEvent);
        
        return savedProduct;
    }

    public Product updateProduct(String productId, Product updatedProduct) {
        Optional<Product> existingProduct = productRepository.findById(productId);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setStockQuantity(updatedProduct.getStockQuantity());
            
            Product savedProduct = productRepository.save(product);
            
            // Send product updated event
            ProductEvent productEvent = new ProductEvent();
            productEvent.setProductId(savedProduct.getId());
            productEvent.setEventType(ProductEvent.EventType.PRODUCT_UPDATED);
            
            productKafkaProducer.sendProductEvent(productEvent);
            
            return savedProduct;
        }
        throw new RuntimeException("Product not found");
    }

    public void deleteProduct(String productId) {
        Optional<Product> existingProduct = productRepository.findById(productId);
        if (existingProduct.isPresent()) {
            productRepository.delete(existingProduct.get());
            
            // Send product deleted event
            ProductEvent productEvent = new ProductEvent();
            productEvent.setProductId(productId);
            productEvent.setEventType(ProductEvent.EventType.PRODUCT_DELETED);
            
            productKafkaProducer.sendProductEvent(productEvent);
        }
    }

    @Transactional
    public void updateInventory(String productId, int quantity) {
        Optional<Product> existingProduct = productRepository.findById(productId);
        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            int newQuantity = product.getStockQuantity() - quantity;
            
            if (newQuantity < 0) {
                throw new RuntimeException("Insufficient stock");
            }
            
            product.setStockQuantity(newQuantity);
            productRepository.save(product);
            
            // Send inventory update event
            InventoryEvent inventoryEvent = new InventoryEvent();
            inventoryEvent.setProductId(productId);
            inventoryEvent.setCurrentStock(newQuantity);
            
            inventoryKafkaProducer.sendInventoryEvent(inventoryEvent);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String productId) {
        return productRepository.findById(productId);
    }
}
