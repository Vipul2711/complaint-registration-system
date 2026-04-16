package com.algo.Complaint_register.controller;

import com.algo.Complaint_register.dto.ComplaintCitizenViewDto;
import com.algo.Complaint_register.dto.ComplaintRequest;
import com.algo.Complaint_register.dto.UserStatsDTO;
import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.service.CitizenService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citizen")

public class CitizenController {
    private final CitizenService  citizenService;

    public CitizenController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }
    @PostMapping("/submit_complaints")
    public ResponseEntity<Complaint> complaintSubmit(@ModelAttribute ComplaintRequest request,
                                                     @AuthenticationPrincipal UserDetails curruser) {
        Complaint createComplaint = citizenService.saveComplaint(request,curruser);

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
                citizenService.getMyComplaints(
                        currentUser, page, size, sortBy, sortDir, status);

        return ResponseEntity.ok(myComplaints);
    }
    @DeleteMapping("/delete_complaint/{id}")
    public ResponseEntity<String> deleteComplaint(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser) {

        citizenService.deleteComplaint(id, currentUser);
        return ResponseEntity.ok("Complaint closed successfully");
    }

    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats(
            @AuthenticationPrincipal UserDetails currentUser) {

        String username = currentUser.getUsername();

        UserStatsDTO stats = citizenService.getUserStats(username);

        return ResponseEntity.ok(stats);
    }

}
