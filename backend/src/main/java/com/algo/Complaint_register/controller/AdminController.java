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
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Create department
    @PostMapping("/createdepartment")
    public ResponseEntity<Department> createDepartment(
            @RequestBody CreateDepartmentRequest request){

        Department department = adminService.createDepartment(request);

        return ResponseEntity.ok(department);
    }


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

    @PutMapping("/assign/{complaintId}")
    public ResponseEntity<ComplaintAssignmentResponseDto> assignComplaint(
            @PathVariable Long complaintId,
            @RequestBody ComplaintAssignmentRequest assignmentRequest) {

        Complaint assignedComplaint = adminService.assignComplaint(complaintId, assignmentRequest);

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
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Status status
    ) {
        return ResponseEntity.ok(
                adminService.getComplaintsByDepartment(deptId, page, size, sortBy, sortDir,status)
        );
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {
        return adminService.getDashboardStats();
    }
}
