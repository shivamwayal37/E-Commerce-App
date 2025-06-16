package com.ecommerce.auth.service.impl;

import com.ecommerce.auth.service.SmsService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class SmsServiceImpl implements SmsService {
    @Value("${sms.enabled:false}")
    private boolean smsEnabled;

    @Override
    public void sendVerificationCode(String phoneNumber, String code) {
        if (!smsEnabled) {
            log.info("SMS service is disabled. Skipping SMS for verification code: {} to number: {}", code, phoneNumber);
            return;
        }
        // TODO: Implement actual SMS sending logic
        log.info("Sending verification code: {} to phone number: {}", code, phoneNumber);
    }

    @Override
    public void sendPasswordResetCode(String phoneNumber, String resetCode) {
        if (!smsEnabled) {
            log.info("SMS service is disabled. Skipping SMS for password reset code: {} to number: {}", resetCode, phoneNumber);
            return;
        }
        // TODO: Implement actual SMS sending logic
        log.info("Sending password reset code: {} to phone number: {}", resetCode, phoneNumber);
    }
}
