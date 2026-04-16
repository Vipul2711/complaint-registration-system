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
    private final CloudinaryService  cloudinaryService;

    public CitizenService(Complaint_Repo complaintRepo,
                            User_Repo userRepo,
                            EmailService emailService, CloudinaryService cloudinaryService) {
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

            // ✅ Max size validation
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

        // 5. Email (unchanged)
        emailService.sendEmail(
                user.getEmail(),
                "Complaint Registered Successfully",
                "Your complaint has been registered successfully.\n\n"
                        + "Complaint ID: " + savedComplaint.getId()
                        + "\nStatus: " + savedComplaint.getStatus()
                        + "\nSubmitted At: " + savedComplaint.getCreatedAt()
        );

        return savedComplaint;
    }

    public Page<ComplaintCitizenViewDto> getMyComplaints(
            UserDetails currentUser,
            int page,
            int size,
            String sortBy,
            String sortDir,
            String status   // 🔥 NEW PARAM
    ) {

        User user = userRepo.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sort sort = sortDir.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // 🔥 UPDATED SPECIFICATION
        Specification<Complaint> spec = (root, query, cb) -> {
            // condition 1: user
            var predicate = cb.equal(root.get("submittedBy"), user);

            // 🔥 condition 2: status (only if provided)
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
            dto.setImageUrl((complaint.getImageUrl()));
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

        // Check if complaint belongs to this user
        if (!complaint.getSubmittedBy().getUsername().equals(currentUser.getUsername())) {
            throw new RuntimeException("You cannot delete this complaint");
        }

        // Check 24 hour rule
        LocalDateTime createdAt = complaint.getCreatedAt();
        LocalDateTime now = LocalDateTime.now();

        long hours = ChronoUnit.HOURS.between(createdAt, now);

        if (hours > 24) {
            throw new RuntimeException("Complaint can only be deleted within 24 hours");
        }

        // Instead of deleting, mark as CLOSED
        if (complaint.getStatus() == Status.RESOLVED) {
            throw new RuntimeException("Resolved complaint cannot be closed");
        }
        complaint.setStatus(Status.CLOSED);

        Complaint updatedComplaint = complaintRepo.save(complaint);

        // Send email
        String citizenEmail = updatedComplaint.getSubmittedBy().getEmail();

        emailService.sendEmail(
                citizenEmail,
                "Complaint Closed",
                "Your complaint has been closed successfully by your-self .\n\n"
                        + "Complaint ID: " + updatedComplaint.getId()
                        + "\nStatus: " + updatedComplaint.getStatus()
        );
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

    public UserStatsDTO getUserStats(String username) {

        long total = complaintRepo.countBySubmittedByUsername(username);

        long submitted = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.SUBMITTED);
        long assigned = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.ASSIGNED);
        long inProgress = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.IN_PROGRESS);
        long resolved = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.RESOLVED);
        long closed = complaintRepo.countBySubmittedByUsernameAndStatus(username, Status.CLOSED);

        return new UserStatsDTO(
                total,
                submitted,
                assigned,
                inProgress,
                resolved,
                closed
        );
    }


}
