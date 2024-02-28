package vn.mobileid.GoPaperless.controller;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import static vn.mobileid.GoPaperless.utils.CommonFunction.HASH_SHA256;

public class test3 {
    public static void main(String[] args) {
        String signerId = "YOUR_PROVIDED_SECOND_SIGNER_ID";
        String type = "SIGNATURE";
        try {
            SignatureField signatureField = generateSignatureField(signerId, type);
            System.out.println("Value: " + signatureField.getValue());
            System.out.println("Suffix: " + signatureField.getSuffix());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    public static String hashAndExtractMiddleSixChars(String input) throws NoSuchAlgorithmException {
        // Sử dụng thuật toán SHA-256 để hash
        MessageDigest md = MessageDigest.getInstance(HASH_SHA256);
        byte[] hashBytes = md.digest(input.getBytes());

        // Chuyển đổi byte array thành chuỗi hex
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }

        // Lấy 6 ký tự ở giữa của chuỗi hex
        int middleIndex = hexString.length() / 2 - 3; // Chọn giữa và lấy 6 ký tự
        return hexString.substring(middleIndex, middleIndex + 6);
    }

    public static SignatureField generateSignatureField(String signerId, String type) throws NoSuchAlgorithmException {
        String suffix = hashAndExtractMiddleSixChars(type + "-" + System.currentTimeMillis());
        String value = signerId + "_" + type + "_" + suffix;
        return new SignatureField(value, suffix);
    }

    public static class SignatureField {
        private String value;
        private String suffix;

        public SignatureField(String value, String suffix) {
            this.value = value;
            this.suffix = suffix;
        }

        public String getValue() {
            return value;
        }

        public String getSuffix() {
            return suffix;
        }
    }
}
