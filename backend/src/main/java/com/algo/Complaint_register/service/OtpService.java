package com.algo.Complaint_register.service;

import com.algo.Complaint_register.util.RedisUtil;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpService {

    private final RedisUtil redisUtil;
    private final EmailService emailService;
    private static final int TTL = 120; // 2 minutes

    public OtpService(RedisUtil redisUtil, EmailService emailService) {
        this.redisUtil = redisUtil;
        this.emailService = emailService;
    }

    public void generateAndSendOtp(String email) {
        String otp = String.valueOf(100000 + new SecureRandom().nextInt(900000));
        redisUtil.set("OTP:" + email, otp, TTL);

        String subject = "Your CivicVoice Verification Code";
        String body = buildOtpEmailBody(otp);

        emailService.sendEmail(email, subject, body);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = redisUtil.get("OTP:" + email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            redisUtil.delete("OTP:" + email);
            return true;
        }
        return false;
    }
    private String buildOtpEmailBody(String otp) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
                <div style="max-width: 500px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">CivicVoice</h1>
                        <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">Government Complaint Portal</p>
                    </div>
                    
                    <!-- Title -->
                    <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 16px 0;">Verify Your Email Address</h2>
                    
                    <!-- Body -->
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">
                        You have requested to verify your email address for your CivicVoice account. 
                        Use the verification code below to complete the process:
                    </p>
                    
                    <!-- OTP Code -->
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 6px; margin: 24px 0;">
                        <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">%s</span>
                    </div>
                    
                    <!-- Expiry Notice -->
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 24px 0;">
                        This code will expire in <strong>2 minutes</strong>. If you did not request this verification, 
                        please ignore this email or contact support.
                    </p>
                    
                    <!-- Divider -->
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                    
                    <!-- Footer -->
                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                        © 2026 CivicVoice. All rights reserved.<br>
                        This is an automated message, please do not reply.
                    </p>
                </div>
            </body>
            </html>
            """, otp);
    }
}