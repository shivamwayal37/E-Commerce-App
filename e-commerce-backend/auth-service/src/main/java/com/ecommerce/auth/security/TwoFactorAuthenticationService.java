package com.ecommerce.auth.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import com.ecommerce.auth.service.EmailService;
import com.ecommerce.auth.service.SmsService;
import com.ecommerce.auth.exception.ResourceNotFoundException;
import com.ecommerce.auth.exception.InvalidRequestException;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TwoFactorAuthenticationService {
    
    private static final int CODE_LENGTH = 6;
    private static final int CODE_EXPIRATION_MINUTES = 5;
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SmsService smsService;
    
    @Transactional
    public String generateTwoFactorCode(String userId) {
        String code = generateRandomCode();
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setTwoFactorCode(code);
        user.setTwoFactorCodeExpiry(LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES));
        userRepository.save(user);
        
        // Send code via email and SMS
        emailService.sendVerificationCode(user.getEmail(), code);
        smsService.sendVerificationCode(user.getPhoneNumber(), code);
        
        return code;
    }

    @Transactional
    public boolean verifyTwoFactorCode(String userId, String code) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (user.getTwoFactorCode() == null) {
            throw new InvalidRequestException("No verification code generated");
        }
        
        if (!user.getTwoFactorCode().equals(code)) {
            throw new InvalidRequestException("Invalid verification code");
        }
        
        if (user.getTwoFactorCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidRequestException("Verification code expired");
        }
        
        // Clear the code after successful verification
        user.setTwoFactorCode(null);
        user.setTwoFactorCodeExpiry(null);
        userRepository.save(user);
        
        return true;
    }

    private String generateRandomCode() {
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        
        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(random.nextInt(10));
        }
        
        return code.toString();
    }
}
