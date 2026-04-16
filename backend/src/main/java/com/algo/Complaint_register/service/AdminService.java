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

    public AdminService(User_Repo userRepository, department_Repo departmentRepository,
                        PasswordEncoder passwordEncoder, Complaint_Repo complaintRepo,
                        EmailService emailService) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.complaintRepo = complaintRepo;
        this.emailService = emailService;
    }

    @Transactional
    public Department createDepartment(CreateDepartmentRequest request) {
        if (departmentRepository.findByUserUsername(request.getDepartmentName()).isPresent()) {
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
    public Complaint assignComplaint(Long complaintId, ComplaintAssignmentRequest request) {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        if (complaint.getStatus() != Status.SUBMITTED) {
            throw new RuntimeException("Only SUBMITTED complaints can be assigned");
        }
        if (complaint.getAssignedDepartment() != null) {
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

    public List<Department> getAllDepartments() {
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
        sendClosureEmail(updatedComplaint);
    }

    public Page<ComplaintAdminViewDto> getAllComplaintsForAdmin(
            Optional<Status> status,
            Optional<Priority> priority,
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
                ComplaintSpecification.filterBy(status, priority, assignedDepartmentId);

        Page<Complaint> complaintPage = complaintRepo.findAll(spec, pageable);

        return complaintPage.map(complaint -> {
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
        stats.put("submitted", complaintRepo.countByStatus(Status.SUBMITTED));
        stats.put("assigned", complaintRepo.countByStatus(Status.ASSIGNED));
        stats.put("inProgress", complaintRepo.countByStatus(Status.IN_PROGRESS));
        stats.put("resolved", complaintRepo.countByStatus(Status.RESOLVED));
        stats.put("closed", complaintRepo.countByStatus(Status.CLOSED));
        stats.put("departments", departmentRepository.count());
        return stats;
    }

    public Page<ComplaintAdminViewDto> getComplaintsByDepartment(
            Long deptId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Status status) {

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

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

    // Email helpers (HTML formatted)

    private void sendStatusUpdateEmail(Complaint complaint) {
        String citizenEmail = complaint.getSubmittedBy().getEmail();
        String locationLink = "https://maps.google.com/?q="
                + complaint.getLatitude() + "," + complaint.getLongitude();

        String subject = "Complaint #" + complaint.getId() + " Status Updated";

        String body = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
                <div style="max-width: 500px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">CivicVoice</h1>
                        <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">Government Complaint Portal</p>
                    </div>
                    <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 16px 0;">Complaint Status Update</h2>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">Dear Citizen,</p>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">
                        Your complaint status has been updated. Below are the current details:
                    </p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 24px 0;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Complaint ID</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">#%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Current Status</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Assigned Department</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">%s</td>
                        </tr>
                    </table>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">
                        <strong>Location:</strong> 
                        <a href="%s" style="color: #2563eb; text-decoration: none;">View on Google Maps</a>
                    </p>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 24px 0;">
                        You can track the full progress of your complaint by logging into your CivicVoice account.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                        © 2026 CivicVoice. All rights reserved.<br>
                        This is an automated message, please do not reply.
                    </p>
                </div>
            </body>
            </html>
            """,
                complaint.getId(),
                complaint.getStatus(),
                complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getName() : "Pending Assignment",
                locationLink
        );

        emailService.sendEmail(citizenEmail, subject, body);
    }

    private void sendClosureEmail(Complaint complaint) {
        String citizenEmail = complaint.getSubmittedBy().getEmail();
        String subject = "Complaint #" + complaint.getId() + " Has Been Closed";

        String body = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
                <div style="max-width: 500px; margin: 20px auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">CivicVoice</h1>
                        <p style="color: #6b7280; margin: 4px 0 0; font-size: 14px;">Government Complaint Portal</p>
                    </div>
                    <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 16px 0;">Complaint Closed</h2>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">Dear Citizen,</p>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">
                        Your complaint has been officially closed. Below are the final details:
                    </p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 24px 0;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Complaint ID</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">#%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Final Status</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Department</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">%s</td>
                        </tr>
                    </table>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 24px 0;">
                        If you believe this was closed in error or require further assistance, 
                        please contact our support team with your Complaint ID.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                        © 2026 CivicVoice. All rights reserved.<br>
                        This is an automated message, please do not reply.
                    </p>
                </div>
            </body>
            </html>
            """,
                complaint.getId(),
                complaint.getStatus(),
                complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getName() : "Not Assigned"
        );

        emailService.sendEmail(citizenEmail, subject, body);
    }
}