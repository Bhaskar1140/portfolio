package com.bhaskar.portfoliobackend.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "admins")
public class Admin {

    @Id
    private String id;

    private String username;
    private String password;
    private String totpSecret;
    private boolean totpEnabled;

    private String resetToken;
    private long resetTokenExpiry;


    public Admin(){

    }

    public Admin(String username, String password){
        this.username = username;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
    public String getTotpSecret(){
        return totpSecret;
    }
    public boolean isTotpEnabled() {
        return totpEnabled;
    }

    public String getResetToken() {
        return resetToken;
    }

    public long getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public String getPassword() {
        return password;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setTotpSecret(String totpSecret) {
        this.totpSecret = totpSecret;
    }

    public void setTotpEnabled(boolean totpEnabled) {
        this.totpEnabled = totpEnabled;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public void setResetTokenExpiry(long resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }
}
