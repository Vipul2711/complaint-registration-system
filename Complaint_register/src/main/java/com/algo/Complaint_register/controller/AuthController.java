package com.algo.Complaint_register.controller;

import com.algo.Complaint_register.dto.AuthRequest;
import com.algo.Complaint_register.dto.AuthResponse;
import com.algo.Complaint_register.dto.RegisterWithOtpRequest;
import com.algo.Complaint_register.dto.UserRegistrationRequest;
import com.algo.Complaint_register.model.User;
import com.algo.Complaint_register.service.AuthService;
import com.algo.Complaint_register.service.EmailService;
import com.algo.Complaint_register.service.JwtUtil;
import com.algo.Complaint_register.service.OtpService;
import com.algo.Complaint_register.service.UserDetailsServicesImp;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServicesImp userDetailsServices;
    private final OtpService otpService;
    private final EmailService emailService;

    public AuthController(
            AuthService authService,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            UserDetailsServicesImp userDetailsServices,
            OtpService otpService,
            EmailService emailService) {

        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsServices = userDetailsServices;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    // ===============================
    // SEND OTP
    // ===============================
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {

        otpService.generateAndSendOtp(email);

        return ResponseEntity.ok("OTP sent to email");
    }

    // ===============================
    // VERIFY OTP + REGISTER USER
    // ===============================
    @PostMapping("/verify-otp-register")
    public ResponseEntity<User> verifyOtpAndRegister(
            @Valid @RequestBody RegisterWithOtpRequest request) {

        boolean verified = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!verified) {
            throw new RuntimeException("Invalid OTP");
        }

        UserRegistrationRequest userRequest = new UserRegistrationRequest();
        userRequest.setUsername(request.getUsername());
        userRequest.setEmail(request.getEmail());
        userRequest.setPassword(request.getPassword());

        User user = authService.registerCitizen(userRequest);

        emailService.sendEmail(
                user.getEmail(),
                "Registration Successful",
                "Your Complaint System account has been created successfully."
        );

        return ResponseEntity.ok(user);
    }

    // ===============================
    // LOGIN
    // ===============================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> createAuthToken(@RequestBody AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        final UserDetails userDetails =
                userDetailsServices.loadUserByUsername(request.getUsername());

        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}