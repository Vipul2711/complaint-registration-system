package com.algo.Complaint_register.repository;

import com.algo.Complaint_register.model.Role;
import com.algo.Complaint_register.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface User_Repo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User>findByRole(Role role);

}
