package com.algo.Complaint_register.service;

import com.algo.Complaint_register.dto.ComplaintAdminViewDto;
import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.Department;
import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;
import com.algo.Complaint_register.repository.Complaint_Repo;
import com.algo.Complaint_register.repository.User_Repo;
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

    private static final long MAX_SIZE = 5 * 1024 * 1024; // 5MB
    private final Complaint_Repo complaintRepo;
    private final department_Repo departmentRepo;
    private final EmailService emailService;

    public DepartmentService(Complaint_Repo complaintRepo,
                            department_Repo departmentRepo ,EmailService emailService) {
        this.complaintRepo = complaintRepo;
        this.departmentRepo = departmentRepo;
        this.emailService = emailService;
    }


    @Transactional
    public Complaint startComplaintWork(Long complaintId, UserDetails currentUser) {

        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String loggedUsername = currentUser.getUsername();

        String complaintDepartmentUser =
                complaint.getAssignedDepartment()
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

        String complaintDepartmentUser =
                complaint.getAssignedDepartment()
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

    public Page<ComplaintAdminViewDto> getDepartmentComplaints(
            UserDetails currentUser,
            int page,
            int size,
            String sortBy,
            String sortDir,
            Status status,
            Priority priority
    ) {

        Department department = departmentRepo
                .findByUserUsername(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // ✅ CALL FILTERED REPO METHOD
        Page<Complaint> complaints =
                complaintRepo.findByDepartmentWithFilters(
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


}
