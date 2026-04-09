package com.algo.Complaint_register.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank
    private String username;
    @NotBlank
    @Size(min =  8, max = 20)
    private String password;
}
