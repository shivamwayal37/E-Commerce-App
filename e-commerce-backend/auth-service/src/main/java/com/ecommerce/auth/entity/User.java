package com.ecommerce.auth.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true)
    private String username;
    
    private String password;
    
    private String email;
    
    private String phoneNumber;
    
    private String twoFactorCode;
    
    @Column(name = "two_factor_code_expiry")
    private LocalDateTime twoFactorCodeExpiry;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
