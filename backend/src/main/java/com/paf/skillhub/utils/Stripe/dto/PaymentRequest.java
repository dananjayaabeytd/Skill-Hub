package com.paf.skillhub.utils.Stripe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
  private Long amount;
  private Long quantity;
  private String name;
  private Long userId;
  private String currency;
}
