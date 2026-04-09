package com.algo.Complaint_register.dto;

import com.algo.Complaint_register.model.Priority;
import com.algo.Complaint_register.model.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintAdminViewDto {
    private Long id;
    private String description;
    private Status status;
    private String submittedByUsername;
    private String assignedDepartmentName;
    private LocalDateTime submittedAt;
    private Priority priority;

    private Double latitude;
    private Double longitude;
    private String imageUrl;



}