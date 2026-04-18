package com.algo.Complaint_register;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ComplaintRegisterApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(ComplaintRegisterApplication.class, args);

		// Block the main thread indefinitely to keep the JVM alive
		try {
			Thread.currentThread().join();
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
		} finally {
			context.close();
		}
	}
}