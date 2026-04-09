package com.algo.Complaint_register.repository;

import com.algo.Complaint_register.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface department_Repo extends JpaRepository<Department, Long> {
    Optional<Department> findByUserUsername(String name);
    long count();
}
