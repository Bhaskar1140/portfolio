package com.bhaskar.portfoliobackend.Controller;

import com.bhaskar.portfoliobackend.DTO.TotpSetupResponse;
import com.bhaskar.portfoliobackend.DTO.TotpVerifyRequest;
import com.bhaskar.portfoliobackend.Model.Admin;
import com.bhaskar.portfoliobackend.Repository.AdminRepository;
import com.bhaskar.portfoliobackend.Service.TOTPService;
import com.google.zxing.WriterException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth/totp")
public class TotpController {
    private final TOTPService totpService;
    private final AdminRepository adminRepository;

    public TotpController(TOTPService totpService, AdminRepository adminRepository){
        this.totpService = totpService;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/setup")
    public TotpSetupResponse setup(Authentication authentication)
    throws WriterException, IOException {
        String username = authentication.getName();
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("Admin not found"));

        String secret = totpService.generateSecret();

        admin.setTotpSecret(secret);
        admin.setTotpEnabled(false);

        adminRepository.save(admin);

        String provisioningUri = totpService.generateProvisioningURI(
                username,
                secret
        );
        String qrCode =
                totpService.generateQRCode(provisioningUri);
        return new TotpSetupResponse(
                "data:image/png;base64,"+qrCode
        );
    }

    @PostMapping("/verify")
    public String verify(
            Authentication authentication,
            @RequestBody TotpVerifyRequest request
            ){
        String username = authentication.getName();
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        boolean valid = totpService.verifyCode(
                admin.getTotpSecret(),
                request.getCode()
        );

        if (!valid) {
            return "Invalid TOTP code";
        }

        admin.setTotpEnabled(true);
        adminRepository.save(admin);

        return "TOTP enabled successfully";

    }
}
