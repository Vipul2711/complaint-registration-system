package com.algo.Complaint_register.service;

import com.algo.Complaint_register.model.OtpVerification;
import com.algo.Complaint_register.repository.Otp_Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
@Service
public class OtpService {

    private final Otp_Repository otpRepository;
    private final EmailService emailService;

    public OtpService(Otp_Repository otpRepository, EmailService emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }

    // 🔹 SEND OTP
    @Transactional
    public void generateAndSendOtp(String email) {

        // 🔸 Get latest OTP
        OtpVerification existing = otpRepository
                .findTopByEmailOrderByCreatedAtDesc(email)
                .orElse(null);

        // ✅ FIX: null-safe check
        if (existing != null && existing.getCreatedAt() != null &&
                existing.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(10))) {

            throw new RuntimeException("Please wait 10 seconds before requesting another OTP");
        }

        // 🧹 delete old OTPs (clean DB)
        otpRepository.deleteByEmail(email);

        // 🔢 generate OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        // 🆕 create new record
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setCreatedAt(LocalDateTime.now());   // ✅ important
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(2));
        otpVerification.setAttempts(0);
        otpVerification.setUsed(false);

        otpRepository.save(otpVerification);

        // 📧 send email
        emailService.sendEmail(
                email,
                "OTP Verification",
                "Your OTP is: " + otp + "\nValid for 2 minutes."
        );
    }

    // 🔹 VERIFY OTP
    public boolean verifyOtp(String email, String otp) {

        OtpVerification record = otpRepository
                .findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        // ✅ null safety (important for old data)
        if (record.getCreatedAt() == null) {
            throw new RuntimeException("Invalid OTP record. Please request a new OTP.");
        }

        // ❌ already used
        if (record.isUsed()) {
            throw new RuntimeException("OTP already used");
        }

        // ❌ expired
        if (record.getExpiryTime() == null ||
                record.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        // ❌ too many attempts
        if (record.getAttempts() >= 2) {
            throw new RuntimeException("Too many attempts");
        }

        // increment attempts
        record.setAttempts(record.getAttempts() + 1);

        // ✅ correct OTP
        if (record.getOtp().equals(otp)) {
            record.setUsed(true);
            otpRepository.save(record);
            return true;
        }

        otpRepository.save(record);
        return false;
    }
}