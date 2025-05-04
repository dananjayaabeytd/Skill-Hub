package com.paf.skillhub.utils.Stripe.controller;

import com.paf.skillhub.utils.Stripe.dto.PaymentRequest;
import com.paf.skillhub.utils.Stripe.dto.StripeResponse;
import com.paf.skillhub.utils.Stripe.service.StripeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

  private StripeService stripeService;

  public PaymentController(StripeService stripeService) {
    this.stripeService = stripeService;
  }

  @PostMapping("/checkout")
  public ResponseEntity<StripeResponse> checkoutProducts(
      @RequestBody PaymentRequest paymentRequest) {
    StripeResponse stripeResponse = stripeService.checkoutProducts(paymentRequest);
    return ResponseEntity
        .status(HttpStatus.OK)
        .body(stripeResponse);
  }
}