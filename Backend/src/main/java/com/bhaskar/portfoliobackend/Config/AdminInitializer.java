package com.bhaskar.portfoliobackend.Config;

import com.bhaskar.portfoliobackend.Model.Admin;
import com.bhaskar.portfoliobackend.Repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ){
       this.adminRepository = adminRepository;
       this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args){



    System.out.println("===== ADMIN INITIALIZER RUNNING =====");

    String username = System.getenv("ADMIN_USERNAME");
    String password = System.getenv("ADMIN_PASSWORD");

    System.out.println("ADMIN_USERNAME: " + username);
    System.out.println("ADMIN_PASSWORD PRESENT: " + (password != null));

            // rest of your code...
        if (username == null || password == null) {
            System.out.println("Admin credentials not configured.");
            return;
        }
        if (adminRepository.findByUsername(username).isEmpty()){
            Admin admin = new Admin();

            admin.setUsername(username);
            admin.setPassword(
                    passwordEncoder.encode(password)
            );
            adminRepository.save(admin);

            System.out.println("Admin account created");
        }
    }
}
