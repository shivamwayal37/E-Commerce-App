# E-commerce Platform - Backend

## Architecture Overview

This project follows a microservices architecture with the following services:

1. **Authentication Service**
   - User registration and login
   - JWT token management
   - Role-based access control

2. **Product Service**
   - Product catalog management
   - Category management
   - Product search and filtering

3. **Shopping Cart Service**
   - Cart management
   - Cart item operations
   - Price calculation

4. **Order Service**
   - Order creation and management
   - Order status tracking
   - Order history

5. **Payment Service**
   - Payment processing
   - Payment gateway integration
   - Transaction management

6. **Infrastructure Services**
   - Eureka Server (Service Discovery)
   - API Gateway
   - Kafka (Event Bus)

## Project Structure

```
e-commerce-backend/
├── auth-service/
├── product-service/
├── cart-service/
├── order-service/
├── payment-service/
├── eureka-server/
├── api-gateway/
└── common/
```

## Prerequisites

- Java 21
- Maven/Gradle
- MySQL 8.0
- Kafka
- Redis (o

## Getting Started

1. Clone the repository
2. Set up the database
3. Configure application properties
4. Start Eureka Server
5. Start API Gateway
6. Start individual microservices

## Configuration

Each service has its own `application.yml` file with specific configurations. The main configuration files are located in:
- `eureka-server/src/main/resources/application.yml`
- `api-gateway/src/main/resources/application.yml`
- Each service's `src/main/resources/application.yml`
