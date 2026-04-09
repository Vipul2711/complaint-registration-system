package com.algo.Complaint_register.repository;

import com.algo.Complaint_register.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface Complaint_Repo extends JpaRepository<Complaint,Long>, JpaSpecificationExecutor<Complaint> {
List<Complaint>findAllByStatusAndAssignedAtBefore(Status status, LocalDateTime beforeDate);
    Page<Complaint> findByAssignedDepartmentId(Long departmentId, Pageable pageable);
    Page<Complaint> findByStatus(Status status, Pageable pageable);
    long countByStatus(Status status);
    Page<Complaint> findBySubmittedByUsername(String username, Pageable pageable);

    Page<Complaint> findBySubmittedByUsernameAndStatus(
            String username,
            Status status,
            Pageable pageable
    );
    @Query("""
    SELECT c FROM Complaint c
    WHERE c.assignedDepartment.id = :deptId
    AND (:status IS NULL OR c.status = :status)
    AND (:priority IS NULL OR c.priority = :priority)
""")
    Page<Complaint> findByDepartmentWithFilters(
            @Param("deptId") Long deptId,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );
    long countBySubmittedByUsername(String username);

    long countBySubmittedByUsernameAndStatus(String username, Status status);
}
