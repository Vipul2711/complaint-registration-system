package com.algo.Complaint_register.controller;

import com.algo.Complaint_register.dto.ComplaintAdminViewDto;
import com.algo.Complaint_register.dto.ComplaintAssignmentRequest;
import com.algo.Complaint_register.dto.ComplaintAssignmentResponseDto;
import com.algo.Complaint_register.dto.CreateDepartmentRequest;
import com.algo.Complaint_register.model.Complaint;
import com.algo.Complaint_register.model.Department;
import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;
import com.algo.Complaint_register.service.AdminService;
import com.algo.Complaint_register.service.ComplaintService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ComplaintService complaintService;

    public AdminController(AdminService adminService, ComplaintService complaintService) {
        this.complaintService = complaintService;
        this.adminService = adminService;
    }

    // === CORRECTED: Returns a safe DTO instead of the User entity ===
    // Create department
    @PostMapping("/createdepartment")
    public ResponseEntity<Department> createDepartment(
            @RequestBody CreateDepartmentRequest request){

        Department department = adminService.createDepartment(request);

        return ResponseEntity.ok(department);
    }

    // === This endpoint was already correct, no changes needed ===
    @GetMapping("/complaints")
    public ResponseEntity<Page<ComplaintAdminViewDto>> getAllComplaints(
            @RequestParam(required = false) Optional<Status> status,
            @RequestParam Optional<Priority> priority,
            @RequestParam(required = false) Optional<Long> assignedDepartmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Page<ComplaintAdminViewDto> complaints = adminService.getAllComplaintsForAdmin(
                status,priority, assignedDepartmentId, page, size, sortBy, sortDir);

        return ResponseEntity.ok(complaints);
    }

    // === CORRECTED: Returns a safe DTO instead of the Complaint_Entity ===
    @PutMapping("/assign/{complaintId}")
    public ResponseEntity<ComplaintAssignmentResponseDto> assignComplaint(
            @PathVariable Long complaintId,
            @RequestBody ComplaintAssignmentRequest assignmentRequest) {

        Complaint assignedComplaint = complaintService.assignComplaint(complaintId, assignmentRequest);

        // Map the full Complaint entity to the safe DTO
        ComplaintAssignmentResponseDto responseDto = new ComplaintAssignmentResponseDto(
                assignedComplaint.getId(),
                assignedComplaint.getStatus(),
                assignedComplaint.getAssignedDepartment().getName(),
                assignedComplaint.getAssignedAt()
        );

        return ResponseEntity.ok(responseDto);
    }
    @PutMapping("/close_complaint/{id}")
    public ResponseEntity<String> closeComplaint(@PathVariable Long id) {

        adminService.closeComplaintByAdmin(id);

        return ResponseEntity.ok("Complaint closed by admin");
    }
//    @PutMapping("/start_work/{id}")
//    public ResponseEntity<String> startWork(@PathVariable Long id){
//
//        complaintService.startComplaintWork(id);
//
//        return ResponseEntity.ok("Complaint work started");
//    }
//
//    @PutMapping("/resolve_complaint/{id}")
//    public ResponseEntity<String> resolveComplaint(@PathVariable Long id){
//
//        complaintService.resolveComplaint(id);
//
//        return ResponseEntity.ok("Complaint resolved successfully");
//    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(adminService.getAllDepartments());
    }
    @GetMapping("/complaints/by-department/{deptId}")
    public ResponseEntity<Page<ComplaintAdminViewDto>> getByDepartment(
            @PathVariable Long deptId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return ResponseEntity.ok(
                complaintService.getComplaintsByDepartment(deptId, page, size, sortBy, sortDir)
        );
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {
        return adminService.getDashboardStats();
    }
}
