package com.ecommerce.payment.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StripePaymentService {
    
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    public String createPaymentIntent(String amount, String currency, String customerId) {
        Stripe.apiKey = stripeSecretKey;
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(Long.parseLong(amount))
            .setCurrency(currency)
            .setCustomer(customerId)
            .build();

        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return paymentIntent.getClientSecret();
        } catch (StripeException e) {
            throw new RuntimeException("Error creating payment intent", e);
        }
    }

    public PaymentIntent confirmPayment(String paymentIntentId) {
        Stripe.apiKey = stripeSecretKey;
        
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            return paymentIntent;
        } catch (StripeException e) {
            throw new RuntimeException("Error confirming payment", e);
        }
    }

    public void cancelPayment(String paymentIntentId) {
        Stripe.apiKey = stripeSecretKey;
        
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            if (paymentIntent.getStatus().equals("requires_payment_method")) {
                paymentIntent.cancel();
            }
        } catch (StripeException e) {
            throw new RuntimeException("Error canceling payment", e);
        }
    }
}
