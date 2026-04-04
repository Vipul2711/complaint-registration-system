package com.algo.Complaint_register.service;

import com.algo.Complaint_register.model.User;
import com.algo.Complaint_register.repository.User_Repo;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServicesImp implements UserDetailsService {
    private final User_Repo userRepo;

    public UserDetailsServicesImp(User_Repo userRepo){
        this.userRepo=userRepo;
    }
@Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(usernameOrEmail)
                        .or(()->userRepo.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + usernameOrEmail));
        List<GrantedAuthority> uathorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_"+user.getRole().name()));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                uathorities
        );
    }
}