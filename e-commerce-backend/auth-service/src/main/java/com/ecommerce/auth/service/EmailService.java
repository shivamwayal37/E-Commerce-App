package com.ecommerce.auth.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void sendVerificationCode(String email, String code);
    void sendPasswordResetLink(String email, String resetLink);
}
