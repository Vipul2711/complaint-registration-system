package com.algo.Complaint_register.controller;

import com.algo.Complaint_register.dto.ComplaintAdminViewDto;
import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;
import com.algo.Complaint_register.service.ComplaintService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/department")
public class DepartmentController {

    private final ComplaintService complaintService;

    public DepartmentController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/complaints")
    public ResponseEntity<Page<ComplaintAdminViewDto>> getDepartmentComplaints(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,

            // ✅ NEW PARAMS
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority
    ) {
        return ResponseEntity.ok(
                complaintService.getDepartmentComplaints(
                        currentUser, page, size, sortBy, sortDir, status, priority
                )
        );
    }
    @PutMapping("/start_work/{complaintId}")
    public ResponseEntity<String> startWork(
            @PathVariable Long complaintId,
            @AuthenticationPrincipal UserDetails currentUser){

        complaintService.startComplaintWork(complaintId, currentUser);

        return ResponseEntity.ok("Work started on complaint");
    }

    @PutMapping("/resolve/{complaintId}")
    public ResponseEntity<String> resolveComplaint(
            @PathVariable Long complaintId,
            @AuthenticationPrincipal UserDetails currentUser){

        complaintService.resolveComplaint(complaintId, currentUser);

        return ResponseEntity.ok("Complaint resolved successfully");
    }

}