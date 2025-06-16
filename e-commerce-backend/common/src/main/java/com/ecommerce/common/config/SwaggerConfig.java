package com.ecommerce.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {
    
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.ecommerce"))
            .paths(PathSelectors.any())
            .build()
            .apiInfo(apiInfo());
    }
    
    private ApiInfo apiInfo() {
        return new ApiInfo(
            "E-commerce API Documentation",
            "API documentation for the E-commerce microservices",
            "1.0",
            "Terms of service",
            new Contact("Your Company", "www.yourcompany.com", "support@yourcompany.com"),
            "License of API",
            "API license URL",
            Collections.emptyList());
    }
}
