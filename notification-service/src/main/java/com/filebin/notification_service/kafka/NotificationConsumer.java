package com.filebin.notification_service.kafka;

import com.filebin.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumer {
    private final NotificationService notificationService;

    @KafkaListener(topics = "${kafka-topic.user-update}")
    public void listenUserUpdate(
            String username,
            @Header(KafkaHeaders.RECEIVED_KEY) String email
    ) {
        log.info("Received user update event for: {}, {}", email, username);
        notificationService.sendUserUpdateEmail(email, username);
    }
}
