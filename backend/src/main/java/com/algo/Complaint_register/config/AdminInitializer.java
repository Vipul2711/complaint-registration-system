package com.algo.Complaint_register.config;

import com.algo.Complaint_register.model.Role;
import com.algo.Complaint_register.model.User;
import com.algo.Complaint_register.repository.User_Repo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {
     private final User_Repo user_repo;
     private final PasswordEncoder passwordEncoder;

     public AdminInitializer(User_Repo user_repo, PasswordEncoder passwordEncoder) {
         this.user_repo = user_repo;
         this.passwordEncoder = passwordEncoder;

     }
     @Override
    public void run(String... args) throws Exception{
         if(user_repo.findByRole(Role.ADMIN).isEmpty()){
             User admin = new User();
             admin.setUsername("admin");
             admin.setEmail("admin@gmail.com");
             admin.setPassword(passwordEncoder.encode("adminpassword"));
             admin.setRole(Role.ADMIN);

             user_repo.save(admin);
             System.out.println("INITIALIZED ADMIN USER");

         }
     }

}
