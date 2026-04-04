package com.algo.Complaint_register.dto;

import lombok.Data;

@Data
public class CreateDepartmentRequest {

    private String departmentName;
    private String username;
    private String email;
    private String password;

}