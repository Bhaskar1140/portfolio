package com.bhaskar.portfoliobackend.DTO;

public class TotpLoginRequest {

    private int code;

    public TotpLoginRequest() {
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}