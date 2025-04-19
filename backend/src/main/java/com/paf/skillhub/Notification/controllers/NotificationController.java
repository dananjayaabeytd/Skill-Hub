package com.paf.skillhub.Notification.controllers;

import com.paf.skillhub.Notification.DTOs.NotificationDTO;
import com.paf.skillhub.Notification.Enums.NotificationType;
import com.paf.skillhub.Notification.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

  @Autowired
  private NotificationService notificationService;

  @PostMapping("/create")
  public ResponseEntity<Void> createNotification(
      @RequestParam Long userId,
      @RequestParam Long senderUserId,
      @RequestParam NotificationType type,
      @RequestParam String message) {
    notificationService.createNotification(userId, senderUserId, type, message);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{userId}")
  public ResponseEntity<Page<NotificationDTO>> getUserNotifications(
      @PathVariable Long userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(notificationService.getUserNotifications(userId, page, size));
  }

  @GetMapping("/{userId}/unread")
  public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable Long userId) {
    return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
  }

  @GetMapping("/{userId}/count")
  public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
    return ResponseEntity.ok(notificationService.getUnreadCount(userId));
  }

  @PutMapping("/{notificationId}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
    notificationService.markAsRead(notificationId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{userId}/read-all")
  public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
    notificationService.markAllAsRead(userId);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{userId}/type/{type}")
  public ResponseEntity<List<NotificationDTO>> getNotificationsByType(
      @PathVariable Long userId,
      @PathVariable NotificationType type) {
    return ResponseEntity.ok(notificationService.getNotificationsByType(userId, type));
  }
}