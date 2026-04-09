package com.algo.Complaint_register.dto;

import com.algo.Complaint_register.model.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ComplaintAssignmentResponseDto {

    private Long complaintId;
    private Status newStatus;
    private String assignedDepartmentName;
    private LocalDateTime assignedAt;
}