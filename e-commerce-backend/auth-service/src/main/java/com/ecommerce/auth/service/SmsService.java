package com.ecommerce.auth.service;

import org.springframework.stereotype.Service;

@Service
public interface SmsService {
    void sendVerificationCode(String phoneNumber, String code);
    void sendPasswordResetCode(String phoneNumber, String resetCode);
}
