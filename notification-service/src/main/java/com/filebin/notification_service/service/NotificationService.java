package com.filebin.notification_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendUserUpdateEmail(String email, String username){
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);

            mimeMessageHelper.setTo(email);
            mimeMessageHelper.setSubject("Your Account Details Have Been Updated");

            Context context = new Context();
            context.setVariable("username", username);

            String emailContent = templateEngine.process("user-update-template", context);

            mimeMessageHelper.setText(emailContent, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("Failed to send email :- {} ", e.getMessage());
        }
    }
}
