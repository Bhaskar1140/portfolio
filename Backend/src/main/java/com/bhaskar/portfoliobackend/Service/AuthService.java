package com.bhaskar.portfoliobackend.Service;

import com.bhaskar.portfoliobackend.Model.Admin;
import com.bhaskar.portfoliobackend.Repository.AdminRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AdminRepository adminRepository;

    public AuthService(AdminRepository adminRepository){
        this.adminRepository = adminRepository;
    }
    public Admin findAdmin(String username){
        return adminRepository.findByUsername(username)
                .orElseThrow(()->new RuntimeException("Admin not Found"));
    }
}
