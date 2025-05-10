package com.paf.skillhub.Notification.DTOs;

import com.paf.skillhub.Notification.Enums.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long notificationId;
    private Long userId;
    private NotificationType notificationType;
    private Long senderUserId;
    private String senderUserName;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}