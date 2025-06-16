package com.ecommerce.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.ecommerce.auth.service.EmailService;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    
    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationCode(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Two-Factor Authentication Code");
        message.setText("Your verification code is: " + code + 
            "\nThis code will expire in 5 minutes.");
        mailSender.send(message);
    }

    @Override
    public void sendPasswordResetLink(String email, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Click the following link to reset your password: " + resetLink +
            "\nThis link will expire in 1 hour.");
        mailSender.send(message);
    }
}
