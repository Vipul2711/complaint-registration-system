package com.algo.Complaint_register.service;

import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ComplaintSpecification {

    public static Specification<Complaint> filterBy(
            Optional<Status> status,
            Optional<Priority> priority,
            Optional<Long> assignedDepartmentId
    ) {
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            //  STATUS FILTER
            status.ifPresent(s ->
                    predicates.add(criteriaBuilder.equal(root.get("status"), s))
            );

            // PRIORITY FILTER (NEW)
            priority.ifPresent(p ->
                    predicates.add(criteriaBuilder.equal(root.get("priority"), p))
            );

            // DEPARTMENT FILTER
            assignedDepartmentId.ifPresent(depId ->
                    predicates.add(criteriaBuilder.equal(
                            root.get("assignedDepartment").get("id"),
                            depId
                    ))
            );

            //  RETURN COMBINED FILTER
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

    }
    public static Specification<Complaint> hasAssignedDepartmentId(Long deptId) {
        return (root, query, cb) -> {
            if (deptId == null) return cb.conjunction();
            return cb.equal(root.get("assignedDepartment").get("id"), deptId);
        };
    }

    public static Specification<Complaint> hasStatus(Status status) {
        return (root, query, cb) -> {
            if (status == null) return cb.conjunction();
            return cb.equal(root.get("status"), status);
        };
    }
}