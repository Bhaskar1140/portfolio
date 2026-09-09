package com.bhaskar.portfoliobackend.Controller;

import com.bhaskar.portfoliobackend.DTO.LoginRequest;
import com.bhaskar.portfoliobackend.DTO.LoginResponse;
import com.bhaskar.portfoliobackend.DTO.ResetPasswordRequest;
import com.bhaskar.portfoliobackend.DTO.TotpLoginRequest;
import com.bhaskar.portfoliobackend.DTO.UpdateUsernameRequest;
import com.bhaskar.portfoliobackend.Model.Admin;
import com.bhaskar.portfoliobackend.Repository.AdminRepository;
import com.bhaskar.portfoliobackend.Service.TOTPService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.FactorGrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.bhaskar.portfoliobackend.DTO.AdminProfileResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AdminRepository adminRepository;
    private final TOTPService totpService;

    public AuthController(
            AuthenticationManager authenticationManager,
            TOTPService totpService,
            AdminRepository adminRepository,
            SecurityContextRepository securityContextRepository,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.adminRepository = adminRepository;
        this.totpService = totpService;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // LOGIN - USERNAME + PASSWORD
    // =========================================================

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        System.out.println("LOGIN METHOD CALLED");
        System.out.println("Username: " + loginRequest.getUsername());

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    loginRequest.getUsername(),
                                    loginRequest.getPassword()
                            )
                    );

            System.out.println("AUTHENTICATION SUCCESSFUL");

            Admin admin = adminRepository.findByUsername(
                    loginRequest.getUsername()
            ).orElseThrow(() ->
                    new RuntimeException("Admin not found")
            );

            /*
             * If TOTP is enabled, do NOT create the
             * fully authenticated session yet.
             *
             * Store the successful password authentication
             * temporarily until TOTP is verified.
             */
            if (admin.isTotpEnabled()) {

                request.getSession(true).setAttribute(
                        "PENDING_AUTHENTICATION",
                        authentication
                );

                return new LoginResponse("TOTP required");
            }

            /*
             * TOTP is not enabled.
             *
             * Password authentication is enough,
             * so create the authenticated session.
             */
            SecurityContext securityContext =
                    SecurityContextHolder.createEmptyContext();

            securityContext.setAuthentication(authentication);

            SecurityContextHolder.setContext(
                    securityContext
            );

            securityContextRepository.saveContext(
                    securityContext,
                    request,
                    response
            );

            return new LoginResponse("Login successful");

        } catch (Exception exception) {

            System.out.println("AUTHENTICATION FAILED");

            System.out.println(
                    "Exception: " +
                            exception.getClass().getName()
            );

            System.out.println(
                    "Message: " +
                            exception.getMessage()
            );

            throw exception;
        }
    }

    // =========================================================
    // TOTP VERIFICATION
    // =========================================================

    @PostMapping("/login/totp")
    public LoginResponse verifyLoginTotp(
            @RequestBody TotpLoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {

        /*
         * Retrieve the authentication that was created
         * after the username/password step.
         */
        Authentication pendingAuthentication =
                (Authentication) httpRequest
                        .getSession(false)
                        .getAttribute("PENDING_AUTHENTICATION");

        if (pendingAuthentication == null) {
            throw new RuntimeException("No pending login");
        }

        String username = pendingAuthentication.getName();

        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Admin not found")
                );

        /*
         * Verify the TOTP code generated by
         * the authenticator application.
         */
        boolean valid = totpService.verifyCode(
                admin.getTotpSecret(),
                request.getCode()
        );

        if (!valid) {
            throw new RuntimeException("Invalid TOTP code");
        }

        /*
         * Password + TOTP have now both been verified.
         *
         * The original authentication contains:
         *
         * ROLE_ADMIN
         * FACTOR_PASSWORD
         *
         * We now add the second-factor authority.
         */
        List<GrantedAuthority> authorities =
                new ArrayList<>(
                        pendingAuthentication.getAuthorities()
                );

        authorities.add(
                new SimpleGrantedAuthority(
                        FactorGrantedAuthority.OTT_AUTHORITY
                )
        );

        /*
         * Create a new authentication containing:
         *
         * ROLE_ADMIN
         * FACTOR_PASSWORD
         * FACTOR_OTT
         */
        Authentication fullyAuthenticated =
                new UsernamePasswordAuthenticationToken(
                        pendingAuthentication.getPrincipal(),
                        pendingAuthentication.getCredentials(),
                        authorities
                );

        /*
         * Create the authenticated SecurityContext.
         */
        SecurityContext securityContext =
                SecurityContextHolder.createEmptyContext();

        securityContext.setAuthentication(
                fullyAuthenticated
        );

        SecurityContextHolder.setContext(
                securityContext
        );

        /*
         * Persist the authenticated SecurityContext
         * inside the HTTP session.
         */
        securityContextRepository.saveContext(
                securityContext,
                httpRequest,
                httpResponse
        );

        /*
         * The password authentication is no longer
         * pending because TOTP has been successfully verified.
         */
        httpRequest.getSession().removeAttribute(
                "PENDING_AUTHENTICATION"
        );

        return new LoginResponse("Login successful");
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @PostMapping("/forgot-password")
    public LoginResponse forgotPassword(
            @RequestBody LoginRequest loginRequest
    ) {

        Admin admin = adminRepository.findByUsername(
                loginRequest.getUsername()
        ).orElseThrow(() ->
                new RuntimeException("Admin not Found")
        );

        String resetToken = UUID.randomUUID().toString();

        long expiry =
                System.currentTimeMillis()
                        + (15 * 60 * 1000);

        admin.setResetToken(resetToken);
        admin.setResetTokenExpiry(expiry);

        adminRepository.save(admin);

        System.out.println("===== PASSWORD RESET =====");
        System.out.println(
                "Username: " + admin.getUsername()
        );
        System.out.println(
                "Reset Token: " + resetToken
        );
        System.out.println(
                "Expires: " + expiry
        );

        return new LoginResponse(
                "Password reset token generated"
        );
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public LoginResponse resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        Admin admin = adminRepository.findAll()
                .stream()
                .filter(a ->
                        request.getToken()
                                .equals(a.getResetToken())
                )
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid reset Token"
                        )
                );

        if (
                System.currentTimeMillis()
                        > admin.getResetTokenExpiry()
        ) {
            throw new RuntimeException(
                    "Reset Token Expired"
            );
        }

        admin.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        admin.setResetToken(null);
        admin.setResetTokenExpiry(0);

        adminRepository.save(admin);

        return new LoginResponse(
                "Password reset successfully"
        );

    }

    @GetMapping("/profile")
    public AdminProfileResponse getProfile(
            Authentication authentication
    ) {

        Admin admin = adminRepository.findByUsername(
                authentication.getName()
        ).orElseThrow(() ->
                new RuntimeException("Admin not found")
        );

        return new AdminProfileResponse(
                admin.getUsername(),
                admin.isTotpEnabled()
        );
    }

    @PutMapping("/profile")
    public AdminProfileResponse updateProfile(
            @Valid @RequestBody UpdateUsernameRequest updateUsernameRequest,
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        Admin admin = adminRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        String username = updateUsernameRequest.getUsername().trim();

        if (!username.equals(admin.getUsername())
                && adminRepository.existsByUsername(username)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username is already in use"
            );
        }

        admin.setUsername(username);
        adminRepository.save(admin);

        Authentication refreshedAuthentication =
                new UsernamePasswordAuthenticationToken(
                        username,
                        authentication.getCredentials(),
                        authentication.getAuthorities()
                );

        SecurityContext refreshedContext =
                SecurityContextHolder.createEmptyContext();
        refreshedContext.setAuthentication(refreshedAuthentication);
        SecurityContextHolder.setContext(refreshedContext);
        securityContextRepository.saveContext(
                refreshedContext,
                request,
                response
        );

        return new AdminProfileResponse(
                admin.getUsername(),
                admin.isTotpEnabled()
        );
    }
}
