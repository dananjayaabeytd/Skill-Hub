package com.paf.skillhub.Notification.repositories;

import com.paf.skillhub.Notification.Enums.NotificationType;
import com.paf.skillhub.Notification.models.Notification;
import com.paf.skillhub.User.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

  Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

  List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);

  long countByUserAndIsReadFalse(User user);

  List<Notification> findByUserAndNotificationTypeOrderByCreatedAtDesc(User user,
      NotificationType notificationType);

  @Modifying
  @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user")
  void markAllAsRead(User user);

  void deleteBySenderUser_UserId(Long senderUserId);

}