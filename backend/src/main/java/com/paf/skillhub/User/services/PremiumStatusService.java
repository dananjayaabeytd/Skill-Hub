package com.paf.skillhub.User.services;

import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PremiumStatusService {

  private final UserRepository userRepository;

  /**
   * Scheduled task that runs daily at midnight to check premium subscriptions
   * and update status for expired subscriptions (> 30 days)
   */
  @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
  @Transactional
  public void updatePremiumStatus() {
    log.info("Running daily premium status check");

    // Get all premium users
    List<User> premiumUsers = userRepository.findByIsPremiumTrue();
    LocalDateTime currentDateTime = LocalDateTime.now();
    int updatedCount = 0;

    for (User user : premiumUsers) {
      // Skip users without a payment date
      if (user.getLastPaymentDateTime() == null) {
        continue;
      }

      // Calculate days since last payment
      long daysSincePayment = ChronoUnit.DAYS.between(user.getLastPaymentDateTime(), currentDateTime);

      // If more than 30 days, update premium status
      if (daysSincePayment > 30) {
        user.setPremium(false);
        userRepository.save(user);
        updatedCount++;
        log.info("Premium expired for user: {}, days since payment: {}", user.getEmail(), daysSincePayment);
      }
    }

    log.info("Premium status check completed. Updated {} users", updatedCount);
  }
}
