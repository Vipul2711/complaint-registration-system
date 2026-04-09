package com.algo.Complaint_register.controller;

import com.algo.Complaint_register.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class EmailController {
    @Autowired
    EmailService emailService;

    @GetMapping("/email")
    public String testEmail(){

        emailService.sendEmail(
                "vipulsurve2212@gmail.com",
                "Test Email",
                "Spring Boot Email Service Working"
        );

        return "Email sent";
    }
}
