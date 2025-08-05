package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.LoginRequest;
import com.ecommerce.auth.dto.LoginResponse;
import com.ecommerce.auth.dto.RegisterRequest;

public interface AuthService {
    LoginResponse authenticate(LoginRequest loginRequest);
    LoginResponse register(RegisterRequest registerRequest);
}
