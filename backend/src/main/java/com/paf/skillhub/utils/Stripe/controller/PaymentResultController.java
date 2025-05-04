package com.paf.skillhub.utils.Stripe.controller;

import com.paf.skillhub.utils.Stripe.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/api/payment")
public class PaymentResultController {

  @Value("${stripe.secretKey}")
  private String secretKey;

  @GetMapping("/success")
  public ModelAndView paymentSuccess(@RequestParam("session_id") String sessionId) {
    Stripe.apiKey = secretKey;

    try {
      Session session = Session.retrieve(sessionId);
      System.out.println("Session details --------------------> " + session);

      // Build the redirect URL to your frontend with query parameters
      String redirectUrl = UriComponentsBuilder
          .fromUriString("http://localhost:5173/payment/success") // Your frontend URL
          .queryParam("session_id", sessionId)
          .queryParam("paymentStatus", session.getPaymentStatus())
          .queryParam("amountTotal", session.getAmountTotal())
          .queryParam("currency", session.getCurrency())
          .queryParam("customerEmail", session.getCustomerDetails() != null ?
              session.getCustomerDetails().getEmail() : "")
          .build()
          .toUriString();

      // Create a redirect view
      RedirectView redirectView = new RedirectView(redirectUrl);
      redirectView.setStatusCode(HttpStatus.FOUND);

      return new ModelAndView(redirectView);

    } catch (StripeException e) {
      // In case of error, still redirect but with error parameters
      String errorRedirectUrl = UriComponentsBuilder
          .fromUriString("http://localhost:5173/payment/error")
          .queryParam("error", "Failed to retrieve payment details: " + e.getMessage())
          .build()
          .toUriString();

      return new ModelAndView(new RedirectView(errorRedirectUrl));
    }
  }

  @GetMapping("/cancel")
  public ResponseEntity<StripeResponse> paymentCanceled() {
    return ResponseEntity.ok(new StripeResponse("CANCELLED", "Payment was cancelled", null, null));
  }
}