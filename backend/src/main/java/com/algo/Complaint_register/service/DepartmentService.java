package com.algo.Complaint_register.service;

import com.algo.Complaint_register.dto.ComplaintAdminViewDto;
import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.Department;
import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;
import com.algo.Complaint_register.repository.Complaint_Repo;
import com.algo.Complaint_register.repository.department_Repo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DepartmentService {

    private final Complaint_Repo complaintRepo;
    private final department_Repo departmentRepo;
    private final EmailService emailService;

    public DepartmentService(Complaint_Repo complaintRepo,
                             department_Repo departmentRepo,
                             EmailService emailService) {
        this.complaintRepo = complaintRepo;
        this.departmentRepo = departmentRepo;
        this.emailService = emailService;
    }

    @Transactional
    public Complaint startComplaintWork(Long complaintId, UserDetails currentUser) {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String loggedUsername = currentUser.getUsername();
        String complaintDepartmentUser = complaint.getAssignedDepartment()
                .getUser()
                .getUsername();

        if (!complaintDepartmentUser.equals(loggedUsername)) {
            throw new RuntimeException("You are not authorized to work on this complaint");
        }

        complaint.setStatus(Status.IN_PROGRESS);
        Complaint updatedComplaint = complaintRepo.save(complaint);

        sendStatusUpdateEmail(updatedComplaint);
        return updatedComplaint;
    }

    @Transactional
    public Complaint resolveComplaint(Long complaintId, UserDetails currentUser) {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String loggedUsername = currentUser.getUsername();
        String complaintDepartmentUser = complaint.getAssignedDepartment()
                .getUser()
                .getUsername();

        if (!complaintDepartmentUser.equals(loggedUsername)) {
            throw new RuntimeException("You are not authorized to resolve this complaint");
        }

        complaint.setStatus(Status.RESOLVED);
        complaint.setResolvedAt(LocalDateTime.now());
        Complaint updatedComplaint = complaintRepo.save(complaint);

        sendStatusUpdateEmail(updatedComplaint);
        return updatedComplaint;
    }

    public Page<ComplaintAdminViewDto> getDepartmentComplaints(
            UserDetails currentUser,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Status status,
            Priority priority) {

        Department department = departmentRepo
                .findByUserUsername(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Complaint> complaints = complaintRepo.findByDepartmentWithFilters(
                department.getId(),
                status,
                priority,
                pageable
        );

        return complaints.map(complaint -> new ComplaintAdminViewDto(
                complaint.getId(),
                complaint.getDescription(),
                complaint.getStatus(),
                complaint.getSubmittedBy().getUsername(),
                complaint.getAssignedDepartment().getName(),
                complaint.getCreatedAt(),
                complaint.getPriority(),
                complaint.getLatitude(),
                complaint.getLongitude(),
                complaint.getImageUrl()
        ));
    }

    // Email helper (HTML formatted)

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
}