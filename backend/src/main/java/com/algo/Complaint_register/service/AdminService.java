package com.algo.Complaint_register.service;

import com.algo.Complaint_register.dto.ComplaintAdminViewDto;
import com.algo.Complaint_register.dto.ComplaintAssignmentRequest;
import com.algo.Complaint_register.dto.CreateDepartmentRequest;
import com.algo.Complaint_register.model.*;
import com.algo.Complaint_register.repository.Complaint_Repo;
import com.algo.Complaint_register.repository.User_Repo;
import com.algo.Complaint_register.repository.department_Repo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class AdminService {
    private final User_Repo userRepository;
    private final department_Repo departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final Complaint_Repo complaintRepo;
    private final EmailService emailService;

    // Constructor injection
    public AdminService(User_Repo userRepository, department_Repo departmentRepository, PasswordEncoder passwordEncoder ,Complaint_Repo complaintRepo,EmailService emailService) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.complaintRepo=complaintRepo;
        this.emailService= emailService;
    }


    @Transactional
    public Department createDepartment(CreateDepartmentRequest request){

        if(departmentRepository.findByUserUsername(request.getDepartmentName()).isPresent()){
            throw new RuntimeException("Department already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.DEPARTMENT);

        User savedUser = userRepository.save(user);

        Department department = new Department();
        department.setName(request.getDepartmentName());
        department.setUser(savedUser);

        return departmentRepository.save(department);
    }


    @Transactional
    public Complaint assignComplaint(
            Long complaintId,
            ComplaintAssignmentRequest request) {

        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        if (complaint.getStatus() != Status.SUBMITTED) {
            throw new RuntimeException("Only SUBMITTED complaints can be assigned");
        }
        if(complaint.getAssignedDepartment() != null){
            throw new RuntimeException("Complaint already assigned to a department");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        complaint.setAssignedDepartment(department);
        complaint.setStatus(Status.ASSIGNED);
        complaint.setAssignedAt(LocalDateTime.now());

        Complaint updatedComplaint = complaintRepo.save(complaint);

        sendStatusUpdateEmail(updatedComplaint);

        return updatedComplaint;

    }


    // Get all departments

    public List<Department> getAllDepartments(){
        return departmentRepository.findAll();
    }


    @Transactional
    public void closeComplaintByAdmin(Long complaintId) {

        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (complaint.getStatus() == Status.RESOLVED) {
            throw new RuntimeException("Resolved complaint cannot be closed");
        }
        complaint.setStatus(Status.CLOSED);

        Complaint updatedComplaint = complaintRepo.save(complaint);

        // Send email to citizen
        String citizenEmail = updatedComplaint.getSubmittedBy().getEmail();

        emailService.sendEmail(
                citizenEmail,
                "Complaint Closed",
                "Your complaint has been closed successfully by Admin .\n\n"
                        + "Complaint ID: " + updatedComplaint.getId()
                        + "\nStatus: " + updatedComplaint.getStatus()
        );
    }

    public Page<ComplaintAdminViewDto> getAllComplaintsForAdmin(
            Optional<Status> status,
            Optional<Priority> priority,   // ✅ NEW
            Optional<Long> assignedDepartmentId,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Complaint> spec =
                ComplaintSpecification.filterBy(status, priority, assignedDepartmentId); // ✅ UPDATED

        Page<Complaint> complaintPage = complaintRepo.findAll(spec, pageable);

        return complaintPage.map(complaint -> {
            long pendingDays = complaint.getCreatedAt() != null
                    ? ChronoUnit.DAYS.between(complaint.getCreatedAt(), LocalDateTime.now())
                    : 0;

            String deptName = complaint.getAssignedDepartment() != null
                    ? complaint.getAssignedDepartment().getName()
                    : "Unassigned";

            String submittedByUsername = complaint.getSubmittedBy() != null
                    ? complaint.getSubmittedBy().getUsername()
                    : "Unknown";

            return new ComplaintAdminViewDto(
                    complaint.getId(),
                    complaint.getDescription(),
                    complaint.getStatus(),
                    submittedByUsername,
                    deptName,
                    complaint.getCreatedAt(),
                    complaint.getPriority(),
                    complaint.getLatitude(),
                    complaint.getLongitude(),
                    complaint.getImageUrl()
            );
        });
    }

    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("total", complaintRepo.count());

        // 🔥 All statuses
        stats.put("submitted", complaintRepo.countByStatus(Status.SUBMITTED));
        stats.put("assigned", complaintRepo.countByStatus(Status.ASSIGNED));
        stats.put("inProgress", complaintRepo.countByStatus(Status.IN_PROGRESS));
        stats.put("resolved", complaintRepo.countByStatus(Status.RESOLVED));
        stats.put("closed", complaintRepo.countByStatus(Status.CLOSED));

        stats.put("departments", departmentRepository.count());

        return stats;
    }

    private void sendStatusUpdateEmail(Complaint complaint) {

        String citizenEmail = complaint.getSubmittedBy().getEmail();

        String locationLink = "https://maps.google.com/?q="
                + complaint.getLatitude() + "," + complaint.getLongitude();

        emailService.sendEmail(
                citizenEmail,
                "Complaint Status Updated",
                "Dear Citizen,\n\n"
                        + "Your complaint status has been updated.\n\n"
                        + "Complaint ID: " + complaint.getId()
                        + "\nNew Status: " + complaint.getStatus()
                        + "\nDepartment: "
                        + (complaint.getAssignedDepartment() != null
                        ? complaint.getAssignedDepartment().getName()
                        : "Pending")
                        + "\n\nLocation:\n" + locationLink
                        + "\n\nThank you."
        );
    }

    public Page<ComplaintAdminViewDto> getComplaintsByDepartment(
            Long deptId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Status status      // ✅ Use this parameter
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // ✅ Build specification with department ID AND status
        Specification<Complaint> spec = Specification
                .where(ComplaintSpecification.hasAssignedDepartmentId(deptId))
                .and(ComplaintSpecification.hasStatus(status));

        Page<Complaint> complaints = complaintRepo.findAll(spec, pageable);

        return complaints.map(c -> new ComplaintAdminViewDto(
                c.getId(),
                c.getDescription(),
                c.getStatus(),
                c.getSubmittedBy() != null ? c.getSubmittedBy().getUsername() : null,
                c.getAssignedDepartment() != null ? c.getAssignedDepartment().getName() : null,
                c.getCreatedAt(),
                c.getPriority(),
                c.getLatitude(),
                c.getLongitude(),
                c.getImageUrl()
        ));
    }

}
