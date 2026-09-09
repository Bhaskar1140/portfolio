package com.bhaskar.portfoliobackend.DTO;

public class TotpSetupResponse {

    private String qrCode;

    public TotpSetupResponse() {
    }

    public TotpSetupResponse(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
}