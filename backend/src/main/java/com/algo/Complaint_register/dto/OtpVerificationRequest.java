package com.algo.Complaint_register.dto;

import lombok.Data;

@Data
public class OtpVerificationRequest {

    private String email;
    private String otp;
}