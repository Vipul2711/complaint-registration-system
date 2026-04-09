package com.algo.Complaint_register.service;

import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;
import com.algo.Complaint_register.repository.Complaint_Repo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintEscalationService {

    private final Complaint_Repo complaintRepo;
    private final EmailService emailService;
    private static final String ADMIN_EMAIL = "admin@gmail.com";

    public ComplaintEscalationService(Complaint_Repo complaintRepo,
                                      EmailService emailService) {
        this.complaintRepo = complaintRepo;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 2 * * ?") // runs every night at 2AM
    public void escalateOldComplaints() {

        LocalDateTime threshold = LocalDateTime.now().minusDays(5);

        List<Complaint> complaints =
                complaintRepo.findAllByStatusAndAssignedAtBefore(
                        Status.IN_PROGRESS,
                        threshold
                );

        for (Complaint complaint : complaints) {

            complaint.setPriority(Priority.HIGH);

            complaintRepo.save(complaint);

            emailService.sendEmail(
                    ADMIN_EMAIL,
                    "Complaint Escalation Alert",
                    "Complaint ID " + complaint.getId()
                            + " has not been resolved for 5 days."
            );
        }
    }
}