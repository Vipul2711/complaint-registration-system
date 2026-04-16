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

        emailService.sendEmail(
                email,
                "OTP Verification",
                "Your OTP is: " + otp + "\nValid for 2 minutes."
        );
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = redisUtil.get("OTP:" + email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            redisUtil.delete("OTP:" + email);
            return true;
        }
        return false;
    }
}