package com.bhaskar.portfoliobackend.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class TOTPService {
    private final GoogleAuthenticator googleAuthenticator;

    public TOTPService(){
        this.googleAuthenticator = new GoogleAuthenticator();

    }
    public String generateSecret(){
        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();

        String secret = key.getKey();
        System.out.println("TOTP SECRET = [" + secret + "]");
        System.out.println("SECRET LENGTH = " + secret.length());

        return secret;
    }

    public boolean verifyCode(String secret, int code){
        return googleAuthenticator.authorize(
                secret,
                code
        );
    }
    public String generateProvisioningURI(
            String username,
            String secret
    ){
        return "otpauth://totp/Portfolio:"
                +username
                +"?secret="
                +secret
                +"&issuer=Portfolio";
    }

    public String generateQRCode(String provisioningUri)
        throws WriterException, IOException{
        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        BitMatrix bitMatrix = qrCodeWriter.encode(
                provisioningUri,
                BarcodeFormat.QR_CODE,
                300,
                300
        );

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        MatrixToImageWriter.writeToStream(
                bitMatrix,
                "PNG",
                outputStream
        );
        return Base64.getEncoder()
                .encodeToString(outputStream.toByteArray());
    }
}
