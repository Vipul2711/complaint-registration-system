package com.algo.Complaint_register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ComplaintRegisterApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComplaintRegisterApplication.class, args);
	}
}