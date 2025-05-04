package com.paf.skillhub.utils.Stripe.service;

import com.paf.skillhub.utils.Stripe.dto.PaymentRequest;
import com.paf.skillhub.utils.Stripe.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

  @Value("${stripe.secretKey}")
  private String secretKey;

  //stripe -API
  //-> productName , amount , quantity , currency
  //-> return sessionId and url


  public StripeResponse checkoutProducts(PaymentRequest paymentRequest) {
    // Set your secret key. Remember to switch to your live secret key in production!
    Stripe.apiKey = secretKey;

    // Product data setup remains the same
    SessionCreateParams.LineItem.PriceData.ProductData productData =
        SessionCreateParams.LineItem.PriceData.ProductData.builder()
            .setName(paymentRequest.getName())
            .build();

    // Price data setup remains the same
    SessionCreateParams.LineItem.PriceData priceData =
        SessionCreateParams.LineItem.PriceData.builder()
            .setCurrency(
                paymentRequest.getCurrency() != null ? paymentRequest.getCurrency() : "USD")
            .setUnitAmount(paymentRequest.getAmount())
            .setProductData(productData)
            .build();

    // Line item setup remains the same
    SessionCreateParams.LineItem lineItem =
        SessionCreateParams
            .LineItem.builder()
            .setQuantity(paymentRequest.getQuantity())
            .setPriceData(priceData)
            .build();

    // Modified URLs to include session_id parameter
    SessionCreateParams params =
        SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("http://localhost:8080/api/payment/success?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl("http://localhost:8080/api/payment/cancel?session_id={CHECKOUT_SESSION_ID}")
            .addLineItem(lineItem)
            .build();

    // Create new session
    Session session = null;
    try {
      session = Session.create(params);
    } catch (StripeException e) {
      // Consider proper error handling here
      return StripeResponse
          .builder()
          .status("ERROR")
          .message("Failed to create payment session: " + e.getMessage())
          .build();
    }

    return StripeResponse
        .builder()
        .status("SUCCESS")
        .message("Payment session created")
        .sessionId(session.getId())
        .sessionUrl(session.getUrl())
        .build();
  }
}
