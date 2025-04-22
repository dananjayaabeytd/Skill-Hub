package com.paf.skillhub.Notification.services;

import com.paf.skillhub.Notification.DTOs.NotificationDTO;
import com.paf.skillhub.Notification.Enums.NotificationType;
import com.paf.skillhub.Notification.models.Notification;
import com.paf.skillhub.Notification.repositories.NotificationRepository;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

  @Autowired
  private NotificationRepository notificationRepository;

  @Autowired
  private UserRepository userRepository;

  public void createNotification(Long userId, Long senderUserId, NotificationType type,
      String message) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    User senderUser = userRepository.findById(senderUserId)
        .orElseThrow(() -> new RuntimeException("Sender user not found with id: " + senderUserId));

    Notification notification = new Notification();
    notification.setUser(user);
    notification.setSenderUser(senderUser);
    notification.setNotificationType(type);
    notification.setMessage(message);
    notification.setIsRead(false);
    notification.setCreatedAt(LocalDateTime.now());

    notificationRepository.save(notification);
  }

  public Page<NotificationDTO> getUserNotifications(Long userId, int page, int size) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    Pageable pageable = PageRequest.of(page, size);
    Page<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user,
        pageable);

    return notifications.map(this::convertToDTO);
  }

  public List<NotificationDTO> getUnreadNotifications(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user)
        .stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public long getUnreadCount(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    return notificationRepository.countByUserAndIsReadFalse(user);
  }

  @Transactional
  public void markAsRead(Long notificationId) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(
            () -> new RuntimeException("Notification not found with id: " + notificationId));

    notification.setIsRead(true);
    notificationRepository.save(notification);
  }

  @Transactional
  public void markAllAsRead(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    notificationRepository.markAllAsRead(user);
  }

  public List<NotificationDTO> getNotificationsByType(Long userId, NotificationType type) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    return notificationRepository.findByUserAndNotificationTypeOrderByCreatedAtDesc(user, type)
        .stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  private NotificationDTO convertToDTO(Notification notification) {
    NotificationDTO dto = new NotificationDTO();
    dto.setNotificationId(notification.getNotificationId());
    dto.setUserId(notification.getUser().getUserId());
    dto.setNotificationType(notification.getNotificationType());
    dto.setSenderUserId(notification.getSenderUser().getUserId());
    dto.setSenderUserName(notification.getSenderUser().getUserName());
    dto.setMessage(notification.getMessage());
    dto.setIsRead(notification.getIsRead());
    dto.setCreatedAt(notification.getCreatedAt());
    return dto;
  }
}