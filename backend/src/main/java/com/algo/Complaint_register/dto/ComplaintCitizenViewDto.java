package com.algo.Complaint_register.dto;

import com.algo.Complaint_register.model.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintCitizenViewDto {
    private Long id;
    private String description;
    private Status status;
    private LocalDateTime createdAt;
    private String assignedDepartmentName;
    private String imageUrl;
}