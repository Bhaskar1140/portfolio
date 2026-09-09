package com.bhaskar.portfoliobackend.DTO;

public class AdminProfileResponse {

    private String username;
    private boolean totpEnabled;

    public AdminProfileResponse(
            String username,
            boolean totpEnabled
    ) {
        this.username = username;
        this.totpEnabled = totpEnabled;
    }

    public String getUsername() {
        return username;
    }

    public boolean isTotpEnabled() {
        return totpEnabled;
    }
}