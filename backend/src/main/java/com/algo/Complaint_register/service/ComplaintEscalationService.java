package com.algo.Complaint_register.service;

import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;
import com.algo.Complaint_register.repository.Complaint_Repo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintEscalationService {

    private final Complaint_Repo complaintRepo;
    private final EmailService emailService;

    @Value("${admin.email:algovortex2711@gmail.com}")
    private String adminEmail;

    public ComplaintEscalationService(Complaint_Repo complaintRepo,
                                      EmailService emailService) {
        this.complaintRepo = complaintRepo;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 2 * * ?") // runs every night at 2 AM
    public void escalateOldComplaints() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(5);

        List<Complaint> complaints = complaintRepo.findAllByStatusAndAssignedAtBefore(
                Status.IN_PROGRESS,
                threshold
        );

        for (Complaint complaint : complaints) {
            complaint.setPriority(Priority.HIGH);
            complaintRepo.save(complaint);

            sendEscalationEmail(complaint);
        }

        if (!complaints.isEmpty()) {
            System.out.println("✅ Escalated " + complaints.size() + " complaints to HIGH priority.");
        }
    }

    private void sendEscalationEmail(Complaint complaint) {
        String subject = "🚨 Escalation Alert: Complaint #" + complaint.getId() + " Overdue";

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
                    <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 16px 0;">Complaint Escalation Alert</h2>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">Dear Administrator,</p>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">
                        The following complaint has been in <strong>IN_PROGRESS</strong> status for over 5 days and has been automatically escalated to <strong>HIGH</strong> priority.
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
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Assigned At</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #1f2937;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">New Priority</td>
                            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #dc2626;">HIGH</td>
                        </tr>
                    </table>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 16px 0;">
                        <strong>Description:</strong> %s
                    </p>
                    <p style="color: #4b5563; line-height: 1.5; margin: 0 0 24px 0;">
                        Please review this complaint and take appropriate action.
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
                complaint.getAssignedDepartment() != null ? complaint.getAssignedDepartment().getName() : "Unassigned",
                complaint.getAssignedAt() != null ? complaint.getAssignedAt().toString() : "N/A",
                complaint.getDescription()
        );

        emailService.sendEmail(adminEmail, subject, body);
    }
}