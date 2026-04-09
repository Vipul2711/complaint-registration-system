package com.algo.Complaint_register.repository;

import com.algo.Complaint_register.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface Otp_Repository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailOrderByExpiryTimeDesc(String email);

    void deleteByEmail(String email);

    Optional<OtpVerification> findTopByEmailOrderByCreatedAtDesc(String email);
}