package com.algo.Complaint_register.service;

import com.algo.Complaint_register.dto.UserRegistrationRequest;
import com.algo.Complaint_register.model.Role;
import com.algo.Complaint_register.model.User;
import com.algo.Complaint_register.repository.User_Repo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final User_Repo user_repo;
    private final PasswordEncoder passwordEncoder;
    public AuthService(User_Repo user_repo, PasswordEncoder passwordEncoder) {
        this.user_repo= user_repo;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerCitizen(UserRegistrationRequest request){
        if(user_repo.findByUsername(request.getUsername()).isPresent() ||user_repo.findByEmail(request.getEmail()).isPresent() ){
            throw  new IllegalArgumentException("Username or email is already taken. ");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(Role.CITIZEN);
        return user_repo.save(user);
    }
}
