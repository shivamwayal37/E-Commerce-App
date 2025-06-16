package com.ecommerce.auth.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.auth.entity.BiometricData;
import com.ecommerce.auth.repository.BiometricDataRepository;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.auth.exception.ResourceNotFoundException;
import com.ecommerce.auth.exception.InvalidRequestException;

import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class BiometricAuthenticationService {
    
    private final UserRepository userRepository;
    private final BiometricDataRepository biometricDataRepository;
    
    @Transactional
    public boolean verifyBiometricData(String userId, BiometricData data) {
        // Get stored biometric data
        BiometricData storedData = biometricDataRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("No biometric data found"));
        
        // Verify biometric match
        return matchBiometricData(storedData.getData(), data.getData());
    }
    
    @Transactional
    public void enrollBiometricData(String userId, BiometricData data) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        
        // Check if biometric data already exists
        if (biometricDataRepository.existsByUserId(userId)) {
            throw new InvalidRequestException("Biometric data already exists");
        }
        
        // Save biometric data
        data.setUserId(userId);
        data.setCreatedAt(LocalDateTime.now());
        data.setUpdatedAt(LocalDateTime.now());
        biometricDataRepository.save(data);
    }
    
    private boolean matchBiometricData(byte[] storedData, byte[] newData) {
        // Implement biometric data matching logic here
        // This is a placeholder - you'll need to implement actual matching logic
        return true;
    }
}
