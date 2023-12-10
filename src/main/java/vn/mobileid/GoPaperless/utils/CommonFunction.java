/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vn.mobileid.GoPaperless.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.bouncycastle.asn1.x500.AttributeTypeAndValue;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import vn.mobileid.GoPaperless.model.apiModel.*;
import vn.mobileid.GoPaperless.model.rsspModel.SignHashResponse;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.*;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


/**
 * @author PHY
 */

public class CommonFunction {

    final public static String HASH_SHA256 = "SHA-256";
    final public static String HASH_SHA1 = "SHA-1";
    public static final String OID_CN = "2.5.4.3";
    public static final String OID_O = "2.5.4.3";

    final public static String HASH_MD5 = "MD5";
    final public static String HASH_SHA384 = "SHA-384";
    final public static String HASH_SHA512 = "SHA-512";

    final public static String HASH_SHA1_ = "SHA1";
    final public static String HASH_SHA256_ = "SHA256";
    final public static String HASH_SHA384_ = "SHA384";
    final public static String HASH_SHA512_ = "SHA512";

    final public static int HASH_MD5_LEN = 16;
    final public static int HASH_MD5_LEN_PADDED = 34;

    final public static int HASH_SHA1_LEN = 20;
    final public static int HASH_SHA1_LEN_PADDED = 35;

    final public static int HASH_SHA256_LEN = 32;
    final public static int HASH_SHA256_LEN_PADDED = 51;

    final public static int HASH_SHA384_LEN = 48;
    final public static int HASH_SHA384_LEN_PADDED = 67;

    final public static int HASH_SHA512_LEN = 64;
    final public static int HASH_SHA512_LEN_PADDED = 83;

    public static String CheckTextNull(String sValue) {
        if (sValue == null) {
            sValue = "";
        } else {
            if (Difinitions.CONFIG_EXCEPTION_STRING_ERROR_NULL.equals(sValue.trim().toUpperCase())) {
                sValue = "";
            }
        }
        return sValue.trim();
    }

    public static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty() || value.trim().equalsIgnoreCase("null");
    }

    public static boolean isNotNullOrEmpty(String value) {
        return value != null && !value.trim().isEmpty() && !value.trim().equalsIgnoreCase("null");
    }

    public static String getCommonNameInDN(String dn) {
        X500Name subject = new X500Name(dn);
        RDN[] rdn = subject.getRDNs();
        for (RDN value : rdn) {
            AttributeTypeAndValue[] attributeTypeAndValue = value.getTypesAndValues();
            if (attributeTypeAndValue[0].getType().toString().equals(OID_CN)) {
                return attributeTypeAndValue[0].getValue().toString();
            }
        }
        return "";
    }

    public static String getPKCS1Signature(String data, String relyingPartyKeyStore, String relyingPartyKeyStorePassword) throws Exception {
        KeyStore keystore = KeyStore.getInstance("PKCS12");
        InputStream is = new FileInputStream(relyingPartyKeyStore);
        System.out.println("relyingPartyKeyStorePassword: " + relyingPartyKeyStorePassword);
        keystore.load(is, relyingPartyKeyStorePassword.toCharArray());

        Enumeration<String> e = keystore.aliases();
        PrivateKey key = null;
        String aliasName = "";
        while (e.hasMoreElements()) {
            aliasName = e.nextElement();
            key = (PrivateKey) keystore.getKey(aliasName, relyingPartyKeyStorePassword.toCharArray());
            if (key != null) {
                break;
            }
        }

        Signature sig = Signature.getInstance("SHA1withRSA");
        sig.initSign(key);
        sig.update(data.getBytes());
        return DatatypeConverter.printBase64Binary(sig.sign());
    }

    public static void VoidCertificateComponents(String certstr, Object[] info, String[] time, int[] intRes) {
        try {
            if (certstr.toUpperCase().contains("BEGIN CERTIFICATE")) {
                certstr = certstr.replace("-----BEGIN CERTIFICATE-----", "");
            }
            if (certstr.toUpperCase().contains("END CERTIFICATE")) {
                certstr = certstr.replace("-----END CERTIFICATE-----", "");
            }
//            DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            CertificateFactory certFactory1 = CertificateFactory.getInstance("X.509");
//            InputStream in = new ByteArrayInputStream(DatatypeConverter.parseBase64Binary(certstr));
            byte[] certBytes = Base64.getDecoder().decode(certstr);
            InputStream in = new ByteArrayInputStream(certBytes);
            X509Certificate cert = (X509Certificate) certFactory1.generateCertificate(in);
            info[0] = cert.getSubjectDN();
            info[0] = info[0].toString().replace("\\", "");
            System.out.println("info[0]: " + info[0]);
            info[1] = cert.getIssuerDN();
            info[2] = cert.getSerialNumber().toString(16);
//            time[0] = formatter.format(cert.getNotBefore());
//            time[1] = formatter.format(cert.getNotAfter());
            time[0] = cert.getNotBefore().toString();
            time[1] = cert.getNotAfter().toString();
            intRes[0] = 0;
        } catch (Exception e) {
            System.out.print("VoidCertificateComponents: " + e.getMessage());
            intRes[0] = 1;
        }
    }

    public static String getCommonnameInDN(String dn) {
        X500Name subject = new X500Name(dn);
        RDN[] rdn = subject.getRDNs();
        for (int j = 0; j < rdn.length; j++) {
            AttributeTypeAndValue[] attributeTypeAndValue = rdn[j].getTypesAndValues();
            if (attributeTypeAndValue[0].getType().toString().equals(OID_O)) {
                return attributeTypeAndValue[0].getValue().toString();
            }
        }
        return "";
    }

    public static String getPropertiesFMS() throws Exception {

        String sPropertiesFMS = "";

        List<ConnectorName> connector = LoadParamSystem.getConnectorStart(Difinitions.CONFIG_LOAD_PARAM_CONNECTOR_NAME);
        if (connector.size() > 0) {
            for (ConnectorName connectorName : connector) {
                if (connectorName.getConnectorName().equals(Difinitions.CONFIG_CONNECTOR_DMS_MOBILE_ID)) {
                    sPropertiesFMS = connectorName.getIdentifier();
                }
            }
//            for (int m = 0; m < connector.size(); m++) {
//                if (connector.get(m).CONNECTOR_NAME.equals(Difinitions.CONFIG_CONNECTOR_DMS_MOBILE_ID)) {
//                    sPropertiesFMS = connector.get(m).IDENTIFIER;
//                }
//            }
        }
        return sPropertiesFMS;
    }

    public static byte[] base64Decode(String s) {
        return Base64.getMimeDecoder().decode(s);
    }

    private static int findMaxLen(byte[][] hashes) {
        int max = 0;
        for (byte[] hh : hashes) {
            if (max < hh.length) {
                max = hh.length;
            }
        }
        return max;
    }

    public static byte[][] padding(byte[][] hashes) {
        int max = findMaxLen(hashes);
        byte[][] rsp = new byte[hashes.length][];

        for (int idx = 0; idx < hashes.length; idx++) {
            int len = hashes[idx].length;
            if (len < max) {
                byte[] tmp = new byte[len];
                System.arraycopy(hashes[idx], 0, tmp, 0, len);
                hashes[idx] = new byte[max];
                System.arraycopy(tmp, 0, hashes[idx], 0, len);
                for (int ii = len; ii < max; ii++) {
                    hashes[idx][ii] = (byte) 0xFF;
                }
            }
        }
        return rsp;
    }

    public static String computeVC(List<byte[]> hashesList) throws NoSuchAlgorithmException {

        byte[][] hashes = new byte[hashesList.size()][];
        for (int i = 0; i < hashesList.size(); i++) {
            hashes[i] = hashesList.get(i);
        }
        if (hashes == null || hashes.length == 0) {
            throw new RuntimeException("The input is null or empty");
        }
        //single hash
        byte[] vcData = new byte[hashes[0].length];
        System.arraycopy(hashes[0], 0, vcData, 0, vcData.length);

        if (hashes.length > 1) {
            padding(hashes);

            for (int ii = 1; ii < hashes.length; ii++) {
                if (hashes[ii].length > vcData.length) {
                    byte[] tmp = new byte[hashes[ii].length];
                    System.arraycopy(vcData, 0, tmp, 0, vcData.length);
                    for (int ttt = vcData.length; ttt < hashes[ii].length; ttt++) {
                        tmp[ttt] = (byte) 0xFF;
                    }
                    vcData = new byte[tmp.length];
                    System.arraycopy(tmp, 0, vcData, 0, tmp.length);
                }
                for (int idx = 0; idx < hashes[ii].length; idx++) {
                    vcData[idx] |= hashes[ii][idx];
                }
            }
        }

        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(vcData);
        byte[] vc = md.digest();
        short first = (short) (vc[0] << 8 | vc[1] & 0x00FF);
        short last = (short) (vc[vc.length - 2] << 8 | vc[vc.length - 1] & 0x00FF);
        return String.format("%04X-%04X", first, last);
    }


    public static String getCryptoHash(String input) {
        try {
            String algorithm = HASH_SHA1;
            if (algorithm.compareToIgnoreCase(HASH_MD5) == 0) {
                algorithm = HASH_MD5;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA1) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA1_) == 0) {
                algorithm = HASH_SHA1;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA256) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA256_) == 0) {
                algorithm = HASH_SHA256;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA384) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA384_) == 0) {
                algorithm = HASH_SHA384;
            } else if (algorithm.compareToIgnoreCase(HASH_SHA512) == 0
                    || algorithm.compareToIgnoreCase(HASH_SHA512_) == 0) {
                algorithm = HASH_SHA512;
            } else {
                algorithm = HASH_SHA256;
            }
            // MessageDigest classes Static getInstance method is called with MD5 hashing
            MessageDigest msgDigest = MessageDigest.getInstance(algorithm);

            // digest() method is called to calculate message digest of the input
            // digest() return array of byte.
            byte[] inputDigest = msgDigest.digest(input.getBytes());

            // Convert byte array into signum representation
            // BigInteger class is used, to convert the resultant byte array into its signum
            // representation
            BigInteger inputDigestBigInt = new BigInteger(1, inputDigest);

            // Convert the input digest into hex value
            String hashtext = inputDigestBigInt.toString(16);

            // Add preceding 0's to pad the hashtext to make it 32 bit
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } // Catch block to handle the scenarios when an unsupported message digest
        // algorithm is provided.
        catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static String cleanCertificate(String base64EncodedCertificate) {
        // Step 1: Decode Base64 string

        // Step 2: Remove "\t", "\r", and "\n"
        String cleanedCertificate = new String(base64EncodedCertificate)
                .replaceAll("\t", "")
                .replaceAll("\r", "")
                .replaceAll("\n", "");

        return cleanedCertificate;
    }

    public static String JsonCertificateObject(String sCertificate, String sCode, String signingTime,
                                               String signingOption,
                                               String sAction, String sToken, String sSigner, String sStatus, String sFile, String sFileSigest,
                                               String sSignature_id, String sCountryCode) {
        String sJson = "";
        try {
            Object[] info = new Object[3];
            String[] time = new String[2];
            int[] intRes = new int[1];
            CertificateObject certObj = null;
            SignerInfoJson signerJson = new SignerInfoJson();
            String cert = cleanCertificate(sCertificate);
            VoidCertificateComponents(cert, info, time, intRes);
            if (intRes[0] == 0) {
                certObj = new CertificateObject();
                certObj.subject = info[0].toString();
                certObj.issuer = info[1].toString();
                certObj.valid_from = time[0];
                certObj.valid_to = time[1];
                certObj.value = sCertificate;
            }
            // signerJson.type = sType;
            signerJson.code = sCode;
            signerJson.certificate = certObj;
            signerJson.signing_time = signingTime;
            signerJson.signing_option = signingOption;
            signerJson.country_code = sCountryCode;
            CertificateJson certJson = new CertificateJson();
            certJson.action = sAction;
            certJson.token = sToken;
            certJson.signer = sSigner;
            certJson.signer_info = signerJson;
            certJson.status = sStatus;
            certJson.file = sFile;
            certJson.file_digest = sFileSigest;
            certJson.valid_to = time[1];
            certJson.signature_id = sSignature_id;
            ObjectMapper oMapperParse = new ObjectMapper();
            sJson = oMapperParse.writeValueAsString(certJson);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return sJson;
    }

    public static String PostBackJsonCertificateObject(String url, String sCertificate, String sCode,
                                                       String signingTime, String signingOption,
                                                       String sAction, String sToken, String sSigner, String sStatus, String sFile, String sFileSigest,
                                                       String sSignature_id, String sCountryCode) {
        String sResult = "0";
        try {
            Object[] info = new Object[3];
            String[] time = new String[2];
            int[] intRes = new int[1];
            CertificateObject certObj = null;
            SignerInfoJson signerJson = new SignerInfoJson();
            VoidCertificateComponents(sCertificate, info, time, intRes);
            if (intRes[0] == 0) {
                certObj = new CertificateObject();
                certObj.subject = info[0].toString();
                certObj.issuer = info[1].toString();
                certObj.valid_from = time[0];
                certObj.valid_to = time[1];
                certObj.value = sCertificate;
            }
            // signerJson.type = sType;
            signerJson.code = sCode;
            signerJson.country_code = sCountryCode;
            // signerJson.certificate = certObj;
            signerJson.signing_time = signingTime;
            signerJson.signing_option = signingOption;
            CertificateJson certJson = new CertificateJson();
            certJson.action = sAction;
            certJson.token = sToken;
            certJson.signer = sSigner;
            certJson.signer_info = signerJson;
            certJson.status = sStatus;
            certJson.file = sFile;
            certJson.file_digest = sFileSigest;
            certJson.valid_to = time[1];
            certJson.signature_id = sSignature_id;
            ObjectMapper oMapperParse = new ObjectMapper();
            String sJson = oMapperParse.writeValueAsString(certJson);
            System.err.println("UrlPostBack: " + url);
            System.err.println("Requet: " + sJson);

            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("action", sAction);
            requestData.put("token", sToken);
            requestData.put("signer", sSigner);
            requestData.put("signer_info", signerJson);
            requestData.put("status", sStatus);
            requestData.put("file", sFile);
            requestData.put("file_digest", sFileSigest);
            requestData.put("valid_to", time[1]);
            requestData.put("signature_id", sSignature_id);
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, String.class);
            System.out.println("response: " + response.getBody());


            // HttpPost request = new HttpPost(url);
            // StringEntity params = new StringEntity(sJson);
            // request.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
            // request.setEntity(params);
            // HttpResponse response = httpClient.execute(request);
            // System.out.println("requestbody PostBackJsonCertificateObject " + response.toString());
        } catch (IOException e) {
            System.out.println(e.getMessage());
            sResult = e.getMessage();
        }
        return sResult;
    }

    public static String PostBackJsonObject(String url, String sCertificate, String sCode,
                                            String signingOption, String sAction, String sToken,
                                            String sSigner, String sStatus, String sFile, String sCountryCode, String file_digest) {
        String sResult = "0";
        try {
            // SignerInfoJson signerJson = new SignerInfoJson();
            // signerJson.type = sType;
            // signerJson.code = sCode;
            // signerJson.signing_option = signingOption;
            // signerJson.country_code = sCountryCode;
            Object[] info = new Object[3];
            String[] time = new String[2];
            int[] intRes = new int[1];
            CertificateObject certObj = null;
            SignerInfoJson signerJson = new SignerInfoJson();
            VoidCertificateComponents(sCertificate, info, time, intRes);
//            PostbackJson certJson = new PostbackJson();
//            certJson.action = sAction;
//            certJson.token = sToken;
//            certJson.status = sStatus;
//            certJson.file = sFile;
//            certJson.file_digest = file_digest;
//            certJson.valid_to = CommonFunction.CheckTextNull(time[1]);
//            // certJson.signer_info = signerJson;
//            ObjectMapper oMapperParse = new ObjectMapper();
//            String sJson = oMapperParse.writeValueAsString(certJson);
//            System.err.println("UrlPostBack: " + url);
//            System.err.println("Request: " + sJson);
//            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), sJson);
//            Request request = new Request.Builder().url(url).post(requestBody).build();
//            Response response = httpClient.newCall(request).execute();
//            System.out.println("requestbody PostBackJsonCertificateObject " + response.toString());

            RestTemplate restTemplate = new RestTemplate();
            String UrlPostBack = url;
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("action", sAction);
            requestData.put("token", sToken);
            requestData.put("status", sStatus);
            requestData.put("file", sFile);
            requestData.put("file_digest", file_digest);
            requestData.put("valid_to", CommonFunction.CheckTextNull(time[1]));
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestData);
            ResponseEntity<String> response = restTemplate.exchange(UrlPostBack, HttpMethod.POST, httpEntity, String.class);
            System.out.println("response: " + response.getBody());

            // HttpPost request = new HttpPost(url);
            // StringEntity params = new StringEntity(sJson);
            // request.setHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE);
            // request.setEntity(params);
            // HttpResponse response = httpClient.execute(request);
            // System.out.println("requestbody PostBackJsonObject " + response.toString());
        } catch (HttpClientErrorException e) {
            HttpStatus statusCode = e.getStatusCode();
            System.out.println("HTTP Status Code: " + statusCode.value());
            sResult = e.getMessage();
        }
        return sResult;
    }

    public static byte[] hashPass(String input) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        return md.digest(input.getBytes(StandardCharsets.UTF_8));
    }

    public static String toHexString(byte[] hash) {
        BigInteger number = new BigInteger(1, hash);
        StringBuilder hexString = new StringBuilder(number.toString(16));
        while (hexString.length() < 64) {
            hexString.insert(0, '0');
        }
        return hexString.toString();
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02X", b));
        }
        return result.toString();
    }

    public static String convertToGetTimeZone(String time){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());

        String zonedDateTimeString = zonedDateTime.toString();
        String[] zonedDateTimeStringArray = zonedDateTimeString.split("\\[");
        //        System.out.println(zonedDateTimeStringWithoutTimeZone);
        return zonedDateTimeStringArray[0];
    }

    public static String convertToGetTimeZoneSmartCert(String time){

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zzz yyyy");
        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
        String zonedDateTimeString = zonedDateTime.toString();
        String[] zonedDateTimeStringArray = zonedDateTimeString.split("\\[");
        //        System.out.println(zonedDateTimeStringWithoutTimeZone);
        return zonedDateTimeStringArray[0];
    }
}
