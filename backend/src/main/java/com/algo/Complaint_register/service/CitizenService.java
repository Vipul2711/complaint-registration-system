package com.algo.Complaint_register.service;

import com.algo.Complaint_register.dto.ComplaintCitizenViewDto;
import com.algo.Complaint_register.dto.ComplaintRequest;
import com.algo.Complaint_register.dto.UserStatsDTO;
import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.Status;
import com.algo.Complaint_register.model.User;
import com.algo.Complaint_register.repository.Complaint_Repo;
import com.algo.Complaint_register.repository.User_Repo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class CitizenService {

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private final Complaint_Repo complaintRepo;
    private final User_Repo userRepo;
    private final EmailService emailService;
    private final CloudinaryService cloudinaryService;

    public CitizenService(Complaint_Repo complaintRepo,
                          User_Repo userRepo,
                          EmailService emailService,
                          CloudinaryService cloudinaryService) {
        this.complaintRepo = complaintRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.cloudinaryService = cloudinaryService;
    }

    @Transactional
    public Complaint saveComplaint(ComplaintRequest request, UserDetails currentUser) {
        // 1. Get logged-in user
        User user = userRepo.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;

        // 2. Validate + Upload image
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            long fileSize = request.getImage().getSize();
            if (fileSize > MAX_SIZE) {
                throw new IllegalArgumentException("Image size must be less than 5MB");
            }
            imageUrl = cloudinaryService.uploadFile(request.getImage());
        }

        // 3. Create complaint
        Complaint complaint = new Complaint();
        complaint.setDescription(request.getDescription());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setStatus(Status.SUBMITTED);
        complaint.setSubmittedBy(user);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setImageUrl(imageUrl);

        // 4. Save
        Complaint savedComplaint = complaintRepo.save(complaint);

        // 5. Send confirmation email (HTML)
        sendRegistrationEmail(savedComplaint);

        return savedComplaint;
    }

    public Page<ComplaintCitizenViewDto> getMyComplaints(
            UserDetails currentUser,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String status) {

        User user = userRepo.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Complaint> spec = (root, query, cb) -> {
            var predicate = cb.equal(root.get("submittedBy"), user);
            if (status != null && !status.equalsIgnoreCase("ALL")) {
                predicate = cb.and(
                        predicate,
                        cb.equal(root.get("status"), Status.valueOf(status))
                );
            }
            return predicate;
        };

        Page<Complaint> complaintPage = complaintRepo.findAll(spec, pageable);

        return complaintPage.map(complaint -> {
            ComplaintCitizenViewDto dto = new ComplaintCitizenViewDto();
            dto.setId(complaint.getId());
            dto.setDescription(complaint.getDescription());
            dto.setStatus(complaint.getStatus());
            dto.setCreatedAt(complaint.getCreatedAt());
            dto.setImageUrl(complaint.getImageUrl());
            dto.setAssignedDepartmentName(
                    complaint.getAssignedDepartment() != null
                            ? complaint.getAssignedDepartment().getName()
                            : "Pending Assignment"
            );
            return dto;
        });
    }

    @Transactional
    public void deleteComplaint(Long complaintId, UserDetails currentUser) {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getSubmittedBy().getUsername().equals(currentUser.getUsername())) {
            throw new RuntimeException("You cannot delete this complaint");
        }

        LocalDateTime createdAt = complaint.getCreatedAt();
        LocalDateTime now = LocalDateTime.now();
        long hours = ChronoUnit.HOURS.between(createdAt, now);
        if (hours > 24) {
            throw new RuntimeException("Complaint can only be deleted within 24 hours");
        }

        if (complaint.getStatus() == Status.RESOLVED) {
            throw new RuntimeException("Resolved complaint cannot be closed");
        }

        complaint.setStatus(Status.CLOSED);
        Complaint updatedComplaint = complaintRepo.save(complaint);

        sendSelfClosureEmail(updatedComplaint);
    }

    public UserStatsDTO getUserStats(String username) {
        long total = complaintRepo.countBySubmittedByUsername(username);
        long submitted = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.SUBMITTED);
        long assigned = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.ASSIGNED);
        long inProgress = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.IN_PROGRESS);
        long resolved = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.RESOLVED);
        long closed = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.CLOSED);

        return new UserStatsDTO(total, submitted, assigned, inProgress, resolved, closed);
    }

    // Email helpers (HTML formatted)

    private void sendRegistrationEmail(Complaint complaint) {
        String citizenEmail = complaint.getSubmittedBy().getEmail();
        String subject = "Complaint #" + complaint.getId() + " Registered Successfully";

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
                    <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 16px 0;">Complaint Registered</h2>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">Dear Citizen,</p>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">
                        Your complaint has been successfully registered in our system. You will receive updates as it progresses.
                    </p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 24px 0;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Complaint ID</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">#%d</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Status</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Submitted At</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">%s</td>
                        </tr>
                    </table>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 24px 0;">
                        You can track the status of your complaint by logging into your CivicVoice account.
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
                complaint.getCreatedAt()
        );

        emailService.sendEmail(citizenEmail, subject, body);
    }

    private void sendSelfClosureEmail(Complaint complaint) {
        String citizenEmail = complaint.getSubmittedBy().getEmail();
        String subject = "Complaint #" + complaint.getId() + " Closed (Self‑Initiated)";

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
                        Your complaint has been closed at your request. Below are the final details:
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
                        If this was a mistake or you need further assistance, please contact our support team.
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
                complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getName() : "Pending Assignment"
        );

        emailService.sendEmail(citizenEmail, subject, body);
    }

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