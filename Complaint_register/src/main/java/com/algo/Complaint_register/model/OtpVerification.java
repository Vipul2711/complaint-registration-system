package com.algo.Complaint_register.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class OtpVerification {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String email;
        private String otp;

        private LocalDateTime expiryTime;
        private LocalDateTime createdAt;

        private int attempts;
        private boolean used;

        @PrePersist
        public void setCreatedAt() {
                this.createdAt = LocalDateTime.now();
        }
}