package com.algo.Complaint_register.config;

import com.algo.Complaint_register.model.Role;
import com.algo.Complaint_register.model.User;
import com.algo.Complaint_register.repository.User_Repo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final User_Repo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.name:admin}")
    private String adminUsername;

    @Value("${admin.email:algovortex2711@gmail.com}")
    private String adminEmail;

    @Value("${admin.password:adminpassword}")
    private String adminPassword;

    public AdminInitializer(User_Repo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if any admin user already exists
        if (userRepo.findByRole(Role.ADMIN).isEmpty()) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);

            userRepo.save(admin);
            System.out.println("✅ ADMIN USER INITIALIZED with username: " + adminUsername);
        } else {
            System.out.println("ℹ️ Admin user already exists – skipping initialization.");
        }
    }
}