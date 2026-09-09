package com.bhaskar.portfoliobackend.DTO;

public class TotpVerifyRequest {

    private int code;

    public TotpVerifyRequest() {
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }
}