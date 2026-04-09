package com.algo.Complaint_register.controller;

import com.algo.Complaint_register.dto.ComplaintCitizenViewDto;
import com.algo.Complaint_register.dto.ComplaintRequest;
import com.algo.Complaint_register.dto.UserStatsDTO;
import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.User;
import com.algo.Complaint_register.service.ComplaintService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;

@RestController
@RequestMapping("/api/citizen")

public class ComplaintController {
    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }
    @PostMapping("/submit_complaints")
    public ResponseEntity<Complaint> complaintSubmit(@ModelAttribute ComplaintRequest request,
                                                     @AuthenticationPrincipal UserDetails curruser) {
        Complaint createComplaint = complaintService.saveComplaint(request,curruser);

        return new ResponseEntity<>(createComplaint, HttpStatus.CREATED);
    }
    @GetMapping("/get_my_complaints")
    public ResponseEntity<Page<ComplaintCitizenViewDto>> getMyComplaints(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status   // 🔥 ADD THIS
    ) {

        Page<ComplaintCitizenViewDto> myComplaints =
                complaintService.getMyComplaints(
                        currentUser, page, size, sortBy, sortDir, status);

        return ResponseEntity.ok(myComplaints);
    }
    @DeleteMapping("/delete_complaint/{id}")
    public ResponseEntity<String> deleteComplaint(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser) {

        complaintService.deleteComplaint(id, currentUser);
        return ResponseEntity.ok("Complaint closed successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats(
            @AuthenticationPrincipal UserDetails currentUser) {

        String username = currentUser.getUsername();

        UserStatsDTO stats = complaintService.getUserStats(username);

        return ResponseEntity.ok(stats);
    }

}
